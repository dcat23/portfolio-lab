import { NotesPageContent } from "@app/lab/components/public/notes/notes-page-content";

export const metadata = {
  title: "Lab Notes | DCatCode",
  description: "Technical findings, observations, and thoughts from the workbench.",
};

export default function NotesPage() {
  return (
    <div className="pt-24">
      <NotesPageContent />
    </div>
  );
}
