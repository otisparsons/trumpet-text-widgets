import { WidgetBoard } from "@/components/WidgetBoard";
import { getWidgets } from "./actions";

export default async function Home() {
  const widgets = await getWidgets();
  return <WidgetBoard initialWidgets={widgets} />;
}
