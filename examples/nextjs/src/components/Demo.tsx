import { useMicVAD, utils } from "@ricky0123/vad-react"
import { useState } from "react"

export const Demo = () => {
  const [audioList, setAudioList] = useState<string[]>([])
  const vad = useMicVAD({
    onSpeechEnd: (audio) => {
      const wavBuffer = utils.encodeWAV(audio)
      const base64 = utils.arrayBufferToBase64(wavBuffer)
      const url = `data:audio/wav;base64,${base64}`
      setAudioList((old) => {
        return [url, ...old]
      })
    },
  })


  return (
    <div className='mx-auto flex flex-col items-center pt-6 '>
      {/* <h6>Listening</h6>
      <p>{!vad.listening && "Not"} listening</p>
      <h6>Loading</h6>
      <p>{!vad.loading && "Not"} loading</p>
      <h6>Errored</h6>
      <p>{!vad.errored && "Not"} errored</p>
      <h6>User Speaking</h6>
      <p> {!vad.userSpeaking && "Not"} speaking</p>
      <h6>Audio count</h6>
      <p>{audioList.length}</p> */}
      <h6>State</h6>
      <p>{vad.listening && "듣는 중"}</p>
      <p>{vad.loading && "대기 중"}</p>
      <p>{vad.errored && "errored"}</p>
      <p>{vad.userSpeaking && "말하는 중"}</p>
      <h6>Start/Pause</h6>
      {/* <button onClick={vad.pause}>Pause</button>
      <button onClick={vad.start}>Start</button> */}
      <button onClick={vad.toggle}>toggle</button>
      <h6>audioList</h6>
      <ol>
        {audioList.map((val)=>{
          return (
            <li>
            <audio src={val} controls/>
            </li>
          )
        })}
      </ol>
      
    </div>
  )
}

export default Demo

