"use client"
import { useActionState, useEffect, useState, useTransition } from "react"
import { handleNext, startSession } from "../lib/actions"
import FormElement from "./FormElement"
import { useFormAudio } from "../hooks/useFormAudio"
import { FormSessionDataType } from "@/types/FormSessionData"


export default function InteractiveForm({ formSessionData }: { formSessionData: FormSessionDataType }) {
  const [sessionData, setSessionData] = useState<FormSessionDataType>(formSessionData);
  const [formCompleted, setFormCompleted] = useState(false);
  const [state, formAction, isPending] = useActionState(handleNext, { message: "", session: sessionData});
  const [resumed, setResumed] = useState(false)
  const [isStarting, startTransition] = useTransition();
  const { audioRef, loadingAudio, playQuestionAudio, stopAudio } = useFormAudio();

  useEffect(() => {
    if (!state.session?.sessionStarted || !resumed) return;
    const currentIndex = state.session.currentFieldIndex;
    if (currentIndex >= state.session.fields.length) {
      setFormCompleted(true);
      stopAudio();
      return;
    }

    const nextField = state.session.fields[currentIndex];
    if (nextField) {
      stopAudio()
      playQuestionAudio(nextField, state.session.session_lang);
    }
  }, [state.session, resumed, playQuestionAudio, stopAudio]);


  function beginSession() {
    startTransition(async () => {
      const updated = await startSession(sessionData.id);
      setSessionData(updated);
      setResumed(true)
      const firstField = updated.fields[updated.currentFieldIndex];
      if (firstField) playQuestionAudio(firstField, updated.session_lang);
    });
  }


  if(state.session?.sessionStarted && !resumed) {
    return <button onClick={() => setResumed(true)}>Resume session</button>
  }

  if (!sessionData.sessionStarted) {
    return (
      <div>
        <button onClick={beginSession} disabled={isStarting} className="border px-4 py-2">
          {isStarting ? "Starting..." : "Start session"}
        </button>
      </div>
    );
  } 


  const currentField = state.session && state.session.fields[state.session.currentFieldIndex];
  if(!currentField) return null

  if (formCompleted) {
    return <p>🎉 Form completed! Thank you.</p>;
  }
  return (
    <div>
      <audio aria-live="polite" ref={audioRef} controls />
      {loadingAudio ? 
       <p>Generating question audio...</p>
       :
      <form action={formAction}>
        <input type="hidden" name="formSessionId" value={sessionData.id} />
        <FormElement
          fieldType={currentField.type}
          options={currentField.options}
          value={currentField.value}
          id={currentField.id}
        />
        <button disabled={isPending || loadingAudio} className={`border px-4 py-2 ${loadingAudio || isPending && 'cursor-not-allowed'}`}>
          Next
        </button>
        {isPending && <p>Updating field in DB...</p>}
      </form>
    }
    </div>
  );
}