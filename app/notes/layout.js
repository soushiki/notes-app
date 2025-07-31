import { Suspense } from "react";

export default function NoteLayout({children}) {
  return (
    <>
      <Suspense fallback={<h6 className="text-gradient">Loading...</h6>}>
          {children}
      </Suspense>
    </>
  )
}
