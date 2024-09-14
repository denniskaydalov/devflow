export * from "./TicketCard";

export interface Ticket {
  id: number;
  title: string;
  content: string;
  status: "in_dev" | "in_test" | "in_review" | "done";
  index: number;
}