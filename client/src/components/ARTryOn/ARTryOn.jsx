import { useEffect, useRef, useState } from 'react'
import { X, Loader2, AlertCircle, Download, RefreshCw, ScanFace } from 'lucide-react'
import * as THREE from 'three'
import ARScene from './ARScene'

/* MediaPipe assets — version pinned to the installed @mediapipe/tasks-vision. */
const MP_VERSION = '0.10.35'
const WASM_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/wasm`
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'

// Anchor on the pupil mid-point (iris centers 468/473) so the lens centers sit
// on the eyes. Iris ring pairs (469↔471, 474↔476) give the iris diameter.
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

export default function ARTryOn({ product, onClose }) {
  const videoRef = useRef(null)
  const stageRef = useRef(null)
  const landmarkerRef = useRef(null)
  const streamRef = useRef(null)
  const rafRef = useRef(0)
  const faceRef = useRef({ found: false })
  const faceShownRef = useRef(false)
  const tmpMat = useRef(new THREE.Matrix4())
  const tmpPos = useRef(new THREE.Vector3())
  const tmpScl = useRef(new THREE.Vector3())

  const [status, setStatus] = useState('loading') // loading | ready | denied | error
  const [errMsg, setErrMsg] = useState('')
  const [faceShown, setFaceShown] = useState(false)
  const [aspect, setAspect] = useState('4 / 3')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    const createLandmarker = (fileset, FaceLandmarker, delegate) =>
      FaceLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate },
        runningMode: 'VIDEO',
        numFaces: 1,
        outputFacialTransformationMatrixes: true, // full head pose (yaw/pitch/roll)
      })

    async function init() {
      setStatus('loading')
      setErrMsg('')
      try {
        const { FaceLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision')
        const fileset = await FilesetResolver.forVisionTasks(WASM_URL)
        let landmarker
        try { landmarker = await createLandmarker(fileset, FaceLandmarker, 'GPU') }
        catch { landmarker = await createLandmarker(fileset, FaceLandmarker, 'CPU') }
        if (cancelled) return landmarker.close?.()
        landmarkerRef.current = landmarker

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        })
        if (cancelled) return stream.getTracks().forEach((t) => t.stop())
        streamRef.current = stream

        const v = videoRef.current
        v.srcObject = stream
        v.onloadedmetadata = () => { if (v.videoWidth) setAspect(`${v.videoWidth} / ${v.videoHeight}`) }
        await v.play()
        if (cancelled) return
        setStatus('ready')
        loop()
      } catch (e) {
        if (cancelled) return
        if (e?.name === 'NotAllowedError' || e?.name === 'SecurityError') setStatus('denied')
        else { setErrMsg(e?.message || 'Could not start AR.'); setStatus('error') }
      }
    }

    function loop() {
      rafRef.current = requestAnimationFrame(loop)
      const v = videoRef.current
      const lm = landmarkerRef.current
      if (!v || !lm || v.readyState < 2 || !v.videoWidth) return

      let res
      try { res = lm.detectForVideo(v, performance.now()) } catch { return }
      const face = res?.faceLandmarks?.[0]
      const mtx = res?.facialTransformationMatrixes?.[0]?.data

      if (!face || !mtx) {
        faceRef.current.found = false
        if (faceShownRef.current) { faceShownRef.current = false; setFaceShown(false) }
        return
      }

      const li = face[468] // left iris center
      const ri = face[473] // right iris center
      const iris = (dist(face[469], face[471]) + dist(face[474], face[476])) / 2

      // Head rotation from the facial transformation matrix.
      tmpMat.current.fromArray(mtx)
      const q = new THREE.Quaternion()
      tmpMat.current.decompose(tmpPos.current, q, tmpScl.current)

      faceRef.current = { found: true, bx: (li.x + ri.x) / 2, by: (li.y + ri.y) / 2, iris, quat: q }
      if (!faceShownRef.current) { faceShownRef.current = true; setFaceShown(true) }
    }

    init()
    return () => {
      cancelled = true
      cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
      landmarkerRef.current?.close?.()
      faceRef.current = { found: false }
      faceShownRef.current = false
    }
  }, [attempt]) // re-runs on retry

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const capture = () => {
    const v = videoRef.current
    const stage = stageRef.current
    if (!v || !stage) return
    const glCanvas = stage.querySelector('canvas')
    const { width: W, height: H } = stage.getBoundingClientRect()
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    // both video + 3D are CSS-mirrored on screen, so flip the capture too
    ctx.save()
    ctx.translate(W, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(v, 0, 0, W, H)
    if (glCanvas) ctx.drawImage(glCanvas, 0, 0, W, H)
    ctx.restore()
    const link = document.createElement('a')
    link.download = `viso-tryon-${product._id}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-[460px] overflow-hidden rounded-2xl bg-ink shadow-pop">
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <ScanFace size={18} className="text-accent" />
            <div>
              <p className="text-sm font-semibold leading-tight">AR Try-On · 3D</p>
              <p className="clamp-1 text-[11px] text-white/55">{product.name}</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* stage */}
        <div ref={stageRef} className="relative w-full overflow-hidden bg-black" style={{ aspectRatio: aspect }}>
          {/* mirror wrap: video + 3D canvas flipped together (selfie) */}
          <div className="absolute inset-0 -scale-x-100">
            <video ref={videoRef} playsInline muted className="absolute inset-0 h-full w-full object-cover" />
            {status === 'ready' && <ARScene faceRef={faceRef} product={product} />}
          </div>

          {/* real-size badge */}
          {status === 'ready' && faceShown && (
            <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-white">
              True size · {product.frameWidthMm || 140}mm
            </div>
          )}

          {/* status overlays */}
          {status === 'loading' && (
            <Overlay>
              <Loader2 size={30} className="animate-spin text-accent" />
              <p className="mt-3 text-sm">Starting camera & loading 3D AR…</p>
              <p className="mt-1 text-xs text-white/50">Allow camera access when asked</p>
            </Overlay>
          )}
          {status === 'denied' && (
            <Overlay>
              <AlertCircle size={30} className="text-amber-400" />
              <p className="mt-3 text-sm font-semibold">Camera access blocked</p>
              <p className="mt-1 max-w-[280px] text-xs text-white/60">Allow camera permission in your browser, then retry.</p>
              <RetryBtn onClick={() => setAttempt((n) => n + 1)} />
            </Overlay>
          )}
          {status === 'error' && (
            <Overlay>
              <AlertCircle size={30} className="text-sale" />
              <p className="mt-3 text-sm font-semibold">Couldn’t start AR</p>
              <p className="mt-1 max-w-[280px] text-xs text-white/60">{errMsg}</p>
              <RetryBtn onClick={() => setAttempt((n) => n + 1)} />
            </Overlay>
          )}
          {status === 'ready' && !faceShown && (
            <div className="pointer-events-none absolute inset-x-0 bottom-3 text-center">
              <span className="rounded-full bg-black/60 px-3 py-1.5 text-xs text-white/85">Look at the camera</span>
            </div>
          )}
        </div>

        {/* controls */}
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <p className="text-[11px] text-white/50">Turn your head — the frame follows in 3D.</p>
          <button
            onClick={capture}
            disabled={status !== 'ready'}
            className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-40"
          >
            <Download size={15} /> Capture
          </button>
        </div>
      </div>
    </div>
  )
}

function Overlay({ children }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-ink/85 px-6 text-center text-white">
      {children}
    </div>
  )
}

function RetryBtn({ onClick }) {
  return (
    <button onClick={onClick} className="mt-4 flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20">
      <RefreshCw size={15} /> Retry
    </button>
  )
}
