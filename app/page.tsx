import { redirect } from "next/navigation";

// La app arranca directo en el login del promotor.
export default function Home() {
  redirect("/login");
}
