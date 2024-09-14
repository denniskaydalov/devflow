export * from "./TicketCard";
export * from "./statuses"; 


export interface Ticket {
  id: number;
  title: string;
  content: string;
  status: "in_dev" | "in_test" | "in_review" | "done";
  index: number;
  assignee?: string;
  reporter: string;
}