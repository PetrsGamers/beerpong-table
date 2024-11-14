import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function SubmitDialog({ handleModalConfirm, description }: any) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="btn btn-primary">Submit</button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader className="bg-white">
          <AlertDialogTitle className="text-black font-bold">
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="btn btn-secondary">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction>
            <button onClick={(e) => handleModalConfirm(e)}>Submit Match</button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
