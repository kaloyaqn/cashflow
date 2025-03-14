
import ExpenseListing from "@/components/expneses-table";

export default function Page() {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      <ExpenseListing limit='5' />
      <div className="bg-muted/50 aspect-video rounded-xl" />
      <div className="bg-muted/50 aspect-video rounded-xl" />
    </div>
  );
}
