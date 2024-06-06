"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Check, Pen, PlusCircle, Trash, XIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { Input } from "../ui/input";
import { DataTable } from "./data-table";

type DataType = {
  id: string;
  task: string;
  completed: boolean;
}[];
export type ToDo = {
  id: string;
  task: string;
  completed: boolean;
};

const supabase = createClient();

export function ClientToDoTable({ data }: { data: DataType }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateTask, setUpdateTask] = useState("");
  const [task, setTask] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  };

  const handleFormSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Add null check for 'user' variable
    if (task !== "") {
      if (user) {
        const { data, error } = await supabase.from("todos").insert({
          user_id: user.id,
          task: task,
          completed: false,
        });
        if (error) {
          console.log("Error inserting data: ", error);
        } else {
          console.log("Data inserted: ", data);
        }
        console.log("Form submitted");
      }
      setTask("");
    } else {
      console.log("Task is empty");
    }
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  };

  const handleEditFormSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number,
    task: string
  ) => {
    event.preventDefault();

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

  const columns: ColumnDef<ToDo>[] = [
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
        const id = row.original.id;

        // This function deletes the task from the database
        const deleteTask = async (id: number) => {
          await supabase.from("todos").delete().eq("id", id);
          console.log("Deleted task with id: ", id);
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
            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(true);
                  setEditingId(id);
                }}
                className="text-green-500"
              >
                <Pen className="h-4 w-4" />
              </Button>
            )}
            {isEditing && (
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditingId(id);
                }}
                className="text-green-500"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div>
        <form>
          {!isEditing && (
            <div className="flex pb-4">
              <Input
                type="text"
                placeholder="Add a new task"
                value={task}
                onChange={handleInputChange}
                className="w-1/4"
              />
              <Button
                variant={"outline"}
                type="submit"
                onClick={handleFormSubmit}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          )}
          {isEditing && (
            <div className="flex pb-4">
              <Input
                type="text"
                placeholder="Edit task ..."
                value={task}
                onChange={handleEditChange}
                className="w-1/4"
              />
              <Button
                variant={"outline"}
                type="submit"
                onClick={(event) => {
                  if (editingId !== null) {
                    handleEditFormSubmit(event, editingId, task);
                  }
                }}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          )}
        </form>
      </div>
      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
