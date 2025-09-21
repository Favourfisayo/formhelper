"use client"
import { useActionState, useEffect, useState } from "react"
import {  handleGoBackAction, handleNextField, handleStartSession } from "../lib/actions"
import FormElement from "./FormElement"
import { useFormAudio } from "../hooks/useFormAudio"
import { FormSessionDataType } from "@/types/FormSessionData"
import { SessionState } from "@/types/SessionState"
import { Button } from "@/components/ui/button"
import Loading from "@/components/app/Loading"
import ExportForm from "@/features/export-form/components/ExportForm"

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
      case "start": {
        const result =  await handleStartSession(prevState, formData);
        return {...result, resumed: true}
      }
      default:
        return prevState;
    }
  },
  { message: "", session: formSessionData }
);
  const [resumed, setResumed] = useState(formSessionData.sessionStarted ? false : true)
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


  if (!state.session?.sessionStarted) {
    return (
      <div className="flex justify-center p-6">
        <form action={formAction}>
          <input type="hidden" name="actionType" value="start" />
          <input type="hidden" name="formSessionId" value={state.session?.id} />
          <Button 
            type="submit"
            disabled={isPending}
            size="lg"
            className="min-w-[200px]"
          >
            {isPending ? "Starting..." : "Start session"}
          </Button>
        </form>
      </div>
    );
  } 
  if(state.session?.sessionStarted && !resumed) {
    return (
      <div className="flex justify-center p-6">
        <Button 
          onClick={() => setResumed(true)}
          size="lg"
          className="min-w-[200px]"
        >
          Resume Session
        </Button>
      </div>
    );
  }
  if (formCompleted) {
    return (
      <ExportForm sessionData = {state.session}/>
    );
  }

  const currentField = state.session && state.session.fields[state.session.currentFieldIndex];
  if(!currentField) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <audio 
          aria-live="polite" 
          ref={audioRef} 
          controls 
          className="max-w-full w-[300px]"
        />
      </div>

      {loadingAudio ? (
        <Loading text="Preparing question audio"/>
      ) : (
        <div className="space-y-8">
          <form 
          onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }}} 
          action={formAction} className="space-y-6">
          <input type="hidden" name="formSessionId" value={state.session.id} />

          <div className="bg-white/5 flex justify-center rounded-lg p-6">
            <FormElement
              key={currentField.id}
              fieldType={currentField.type}
              options={currentField.options}
              value={currentField.value}
              id={currentField.id}
            />
          </div>
            {isPending && (
            <Loading text="Updating form..."/>
          )}
          <div className="flex items-center justify-between gap-4 pt-4">
            <Button
              type="submit"
              name="actionType"
              value="back"
              variant="outline"
              disabled={isPending || state.session.currentFieldIndex === 0}
            >
              Back
            </Button>

            <Button
              type="submit"
              name="actionType"
              value="next"
              disabled={isPending || loadingAudio}
            >
              Next
            </Button>
          </div>
        </form>

        </div>
      )}
    </div>
  );
  
}