"use client"
import { useActionState, useEffect, useState } from "react"
import {  handleGoBackAction, handleNextField, handleStartSession } from "../lib/actions"
import FormElement from "./FormElement"
import { useFormAudio } from "../hooks/useFormAudio"
import { FormSessionDataType } from "@/types/FormSessionData"
import { SessionState } from "@/types/SessionState"

type ActionType =  "next" | "back" | "start"
export default function InteractiveForm({ formSessionData }: { formSessionData: FormSessionDataType }) {
  const [formCompleted, setFormCompleted] = useState(false);
  const [state,  formAction, isPending] =  useActionState(
  async (prevState: SessionState, formData: FormData) => {
    const actionType = formData.get("actionType") as ActionType;

    switch(actionType) {
      case "next":
        return await handleNextField(prevState, formData);
      case "back":
        return await handleGoBackAction(prevState, formData);
      case "start":
        return await handleStartSession(prevState, formData);
      default:
        return prevState;
    }
  },
  { message: "", session: formSessionData }
);
  const [resumed, setResumed] = useState(false)
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
      playQuestionAudio(nextField, state.session);
    }
  }, [state.session, resumed, playQuestionAudio, stopAudio]); 


  if(state.session?.sessionStarted && !resumed) {
    return <button onClick={() => setResumed(true)}>Resume session</button>
  }

  if (!state.session?.sessionStarted) {
    return (
      <form action={formAction}>
        <input type="hidden" name="actionType" value="start" />
        <input type="hidden" name="formSessionId" value={state.session?.id} />
        <button disabled={isPending} className="border px-4 py-2">
          {isPending ? "Starting..." : "Start session"}
        </button>
      </form>
    );
  } 

  
  if (formCompleted) {
    return (
      <div></div>
    );
  }

  const currentField = state.session && state.session.fields[state.session.currentFieldIndex];
  if(!currentField) return null
  return (
    <>
      <audio aria-live="polite" ref={audioRef} controls />
      {loadingAudio ? 
       <p>Preparing question audio...</p>
       :
       <div>
      <form action={formAction}>
         <input type="hidden" name="formSessionId" value={state.session.id} />
          <input type="hidden" name="actionType" value="next" />
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
      <form action={formAction}>
        <input type="hidden" name="actionType" value="back" />
        <input type="hidden" name="formSessionId" value={state.session.id} />
        <button disabled={isPending} className="border px-4 py-2">
          Back
        </button>
      </form>
      </div>
    }
    </>
  );
}