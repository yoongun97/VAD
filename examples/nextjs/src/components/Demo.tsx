import { useMicVAD, utils } from "@ricky0123/vad-react"
import { useState } from "react"
import axios from "axios"

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY

export const Demo = () => {
  const [audioList, setAudioList] = useState<string[]>([])
  const vad = useMicVAD({
    onSpeechEnd: (audio) => {
      const wavBuffer = utils.encodeWAV(audio)
      const base64 = utils.arrayBufferToBase64(wavBuffer)
      const url = `data:audio/wav;base64,${base64}`
      urlToFile(url)
    },
  })

  const urlToFile = async (url: string) => {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      fileToText(blob)
    } catch (err) {
      console.error(err)
    }
  }

  const fileToText = async (blob: Blob) => {
    const formData = new FormData()
    formData.append("file", blob, "audio.wav")
    formData.append("model", "whisper-1")
    try {
      const res = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "multipart/form-data",
          },
        },
      )
      const newText = res.data.text
      setAudioList((old) => {
        return [newText, ...old]
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="mx-auto flex flex-col items-center pt-6 ">
      <h6>State</h6>
      <p>{vad.listening && "듣는 중"}</p>
      <p>{vad.loading && "대기 중"}</p>
      <p>{vad.errored && "errored"}</p>
      <p>{vad.userSpeaking && "녹음 중"}</p>
      <h6>Start/Pause</h6>
      <button onClick={vad.pause}>Pause</button>
      <button onClick={vad.start}>Start</button>
      {/* <button onClick={vad.toggle}>toggle</button> */}
      <h6>audioList</h6>
      <ol>
        {audioList.map((val, index) => {
          return <li key={index}>{val}</li>
        })}
      </ol>
    </div>
  )
}

export default Demo
