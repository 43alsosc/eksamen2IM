"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Check, Pen, Trash, XIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { Input } from "../ui/input";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

const supabase = createClient();

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-center">Id</div>,
    cell: ({ row }: { row: any }) => {
      const id = row.getValue("id");
      const formatted = typeof id === "number" ? id.valueOf() : id;

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "completed",
    header: () => <div className="text-center">Completed</div>,
    cell: ({ row }: { row: any }) => {
      const completed = row.getValue("completed");
      const id = row.original.id;

      // This function updates the task in the database
      const updateTask = async (id: number, completed: boolean) => {
        await supabase.from("todos").update({ completed }).eq("id", id);
        console.log(completed);
        const { data, error } = await supabase
          .from("todos")
          .select("*")
          .eq("id", id);

        if (error) {
          console.error("Error fetching updated data:");
        } else {
          console.log("Updated data: ", data);
        }
      };

      // This function is called when the button is clicked
      const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        updateTask(id, !completed);
      };

      return (
        <div className="text-center font-medium">
          <Button
            variant="outline"
            className="text-green-500 bg-transparent"
            onClick={handleClick}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "task",
    header: () => <div className="text-center">Task</div>,
    cell: ({ row }: { row: any }) => {
      const task = row.getValue("task");
      const formatted = typeof task === "string" ? task.valueOf() : task;

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }: { row: any }) => {
      const [isEditing, setIsEditing] = useState(false);
      const [updateTask, setUpdateTask] = useState("");

      const id = row.original.id;

      // This function deletes the task from the database
      const deleteTask = async (id: number) => {
        await supabase.from("todos").delete().eq("id", id);
        console.log("Deleted task with id: ", id);
      };

      const editTask = async (id: number, task: string) => {
        const { data, error } = await supabase
          .from("todos")
          .update({ task })
          .eq("id", id);

        if (error) {
          console.error("Error fetching data to edit:");
        } else {
          console.log("Edit data: ");
          setIsEditing(false); // Hide the input field after successful update
        }
      };

      // This function is called when the button is clicked
      const handleDeleteClick = (
        event: React.MouseEvent<HTMLButtonElement>
      ) => {
        event.preventDefault();
        deleteTask(id);
      };

      return (
        <div className="text-center font-medium">
          <Button
            variant="outline"
            className="text-red-500 bg-transparent"
            onClick={handleDeleteClick}
          >
            <Trash className="h-4 w-4" />
          </Button>
          {isEditing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                editTask(id, updateTask);
                setUpdateTask("");
              }}
            >
              <div>
                <Input
                  type="text"
                  placeholder="Edit task"
                  value={updateTask}
                  onChange={(e) => setUpdateTask(e.target.value)}
                  autoFocus
                />
                <Button
                  variant="outline"
                  type="submit"
                  className="text-green-500"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="text-red-500"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            </form>
          ) : (
            <Button
              variant="outline"
              className="text-green-500 bg-transparent"
              onClick={() => setIsEditing(true)}
            >
              <Pen className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
  },
];
