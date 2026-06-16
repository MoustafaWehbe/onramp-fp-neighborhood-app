import { createContext, useContext, useState, type ReactNode } from "react";
import { MOCK_ISSUES, type Issue, type Status, type Comment } from "./mock-data";

export type Role = "Resident" | "Authority" | "Admin";

interface AppState {
  role: Role;
  setRole: (r: Role) => void;
  user: string;
  issues: Issue[];
  addIssue: (i: Omit<Issue, "id" | "createdAt" | "log" | "comments" | "upvotes" | "status">) => Issue;
  updateStatus: (id: string, status: Status, note?: string) => void;
  addComment: (id: string, text: string) => void;
  upvote: (id: string) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("Resident");
  const [issues, setIssues] = useState<Issue[]>(MOCK_ISSUES);

  const userByRole: Record<Role, string> = {
    Resident: "Maya Chen",
    Authority: "City Works",
    Admin: "Platform Admin",
  };

  const addIssue: AppState["addIssue"] = (data) => {
    const id = `ISS-${1043 + issues.length}`;
    const issue: Issue = {
      ...data,
      id,
      status: "Reported",
      createdAt: new Date().toISOString(),
      upvotes: 1,
      log: [{ status: "Reported", at: new Date().toISOString(), by: data.reporter }],
      comments: [],
    };
    setIssues((p) => [issue, ...p]);
    return issue;
  };

  const updateStatus: AppState["updateStatus"] = (id, status, note) => {
    setIssues((p) =>
      p.map((i) =>
        i.id === id
          ? {
              ...i,
              status,
              log: [...i.log, { status, at: new Date().toISOString(), by: userByRole[role], note }],
            }
          : i,
      ),
    );
  };

  const addComment: AppState["addComment"] = (id, text) => {
    const c: Comment = {
      id: `c-${Date.now()}`,
      author: userByRole[role],
      role: role === "Resident" ? "Resident" : "Authority",
      at: new Date().toISOString(),
      text,
    };
    setIssues((p) => p.map((i) => (i.id === id ? { ...i, comments: [...i.comments, c] } : i)));
  };

  const upvote: AppState["upvote"] = (id) => {
    setIssues((p) => p.map((i) => (i.id === id ? { ...i, upvotes: i.upvotes + 1 } : i)));
  };

  return (
    <Ctx.Provider value={{ role, setRole, user: userByRole[role], issues, addIssue, updateStatus, addComment, upvote }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used within AppProvider");
  return v;
}
