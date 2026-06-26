import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../lib/app-state";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Sparkles, RefreshCw } from "lucide-react";
import {
  CATEGORIES,
  NEIGHBORHOODS,
  type Category,
  aiSuggest,
} from "../../lib/mock-data";

export function ReportIssue() {
  const { addIssue, user } = useApp();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [neighborhood, setNeighborhood] = useState("");
  const [address, setAddress] = useState("");
  const [aiNote, setAiNote] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  function handleAnalyze() {
    if (!description.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      const result = aiSuggest(description);
      setCategory(result.category);
      setAiNote(result.note);
      setAnalyzing(false);
    }, 800);
  }

  function handleSubmit() {
    if (!title || !description || !category || !neighborhood) {
      alert("Please fill in all required fields.");
      return;
    }
    addIssue({
      title,
      description,
      category: category as Category,
      neighborhood,
      address,
      reporter: user,
      aiRoutingNote: aiNote ?? undefined,
    });
    navigate("/");
  }

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-2xl shadow-soft border-border/60 rounded-2xl">
        <CardContent className="p-8 space-y-6">
          {/* header */}
          <div className="space-y-1">
            <h2 className="text-3xl font-bold">
              Tell your neighbors what's wrong
            </h2>
            <p className="text-muted-foreground text-sm">
              The more specific you are,{" "}
              <span className="text-accent font-medium">
                the faster the right department gets to it.
              </span>
            </p>
          </div>

          {/* title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="font-medium">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Pothole on Bliss Street"
              className="rounded-xl"
            />
          </div>

          {/* description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A deep pothole roughly 60cm wide near the crossing..."
              rows={5}
              className="rounded-xl resize-none"
            />
            <p className="text-xs text-accent">
              Describe what you see and where exactly.
            </p>
          </div>

          {/* smart routing */}
          <div className="rounded-xl border border-border/60 bg-slate-50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-white border border-border/60 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold">Smart routing</p>
                {aiNote ? (
                  <p className="text-xs text-muted-foreground max-w-sm">
                    {aiNote}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Click{" "}
                    <span className="font-semibold text-foreground">
                      Analyze
                    </span>{" "}
                    and AI will suggest the best category and who handles it.
                  </p>
                )}
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5 text-sm"
              onClick={handleAnalyze}
              disabled={analyzing || !description.trim()}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${analyzing ? "animate-spin" : ""}`}
              />
              {analyzing ? "Analyzing..." : "Analyze"}
            </Button>
          </div>

          {/* category + neighborhood */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="category" className="font-medium">
                Category
              </Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as Category)}
              >
                <SelectTrigger id="category" className="rounded-xl">
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

            <div className="space-y-1.5">
              <Label htmlFor="neighborhood" className="font-medium">
                Neighborhood
              </Label>
              <Select value={neighborhood} onValueChange={setNeighborhood}>
                <SelectTrigger id="neighborhood" className="rounded-xl">
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
          </div>

          {/* address */}
          <div className="space-y-1.5">
            <Label htmlFor="address" className="font-medium">
              Address or location
            </Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Bliss St Hamra"
              className="rounded-xl"
            />
          </div>

          {/* actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl px-6"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-xl px-6"
              onClick={handleSubmit}
            >
              Submit report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
