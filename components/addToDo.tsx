"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function AddToDo() {
  const [task, setTask] = useState("");

  const supabase = createClient();

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

  return (
    <div>
      <form>
        <div className="flex pb-4">
          <Input
            type="text"
            placeholder="Add a new task"
            value={task}
            onChange={handleInputChange}
            className="w-1/4"
          />
          <Button variant={"outline"} type="submit" onClick={handleFormSubmit}>
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
