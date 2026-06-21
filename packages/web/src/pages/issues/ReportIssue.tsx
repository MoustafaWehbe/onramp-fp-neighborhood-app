import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { CATEGORIES, NEIGHBORHOODS, type Category } from "../../lib/mock-data";
import { useApp } from "../../lib/app-state";

export function ReportIssue() {
  const navigate = useNavigate();
  const { addIssue, user } = useApp();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [neighborhood, setNeighborhood] = useState("");
  const [address, setAddress] = useState("");

  function handleSubmit() {
    if (!title || !description || !category || !neighborhood || !address) {
      alert("Please fill in all fields.");
      return;
    }

    const newIssue = addIssue({
      title,
      description,
      category,
      neighborhood,
      address,
      reporter: user,
    });

    navigate(`/issue/${newIssue.id}`);
  }

  return (
    <div className="p-6 max-w-xl space-y-4">
      <h2 className="text-xl font-semibold">Report an Issue</h2>

      <div className="space-y-1">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Pothole on Elm Street"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue in detail..."
          rows={4}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="neighborhood">Neighborhood</Label>
        <Select value={neighborhood} onValueChange={setNeighborhood}>
          <SelectTrigger id="neighborhood">
            <SelectValue placeholder="Select a neighborhood" />
          </SelectTrigger>
          <SelectContent>
            {NEIGHBORHOODS.map((n) => (
              <SelectItem key={n} value={n}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g. Elm St & 4th Ave"
        />
      </div>

      <Button onClick={handleSubmit}>Submit report</Button>
    </div>
  );
}