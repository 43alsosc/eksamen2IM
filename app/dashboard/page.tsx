import { ClientToDoTable } from "@/components/data-table/client-todo-table";
import { columns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/data-table";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

async function getData() {
  const supabase = createClient();

  const { data, error } = await supabase.from("todos").select("*");

  if (error) {
    console.error("Error fetching data: ", error);
    return [];
  }

  return data;
}

export default async function Page() {
  // Hent data fra databasen
  const tableData = await getData();

  // Hvis brukeren ikke er logget inn, send dem til innloggingssiden
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/signin");
  }

  return (
    <div className="w-full flex flex-wrap flex-col items-center justify-center">
      <h1>Dashboard</h1>
      <div className="w-3/4">
        <ClientToDoTable data={tableData} />
      </div>
    </div>
  );
}
