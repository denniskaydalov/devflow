import type { Ticket } from ".";

export const statuses: Ticket["status"][] = [
  "in_dev",
  "in_test",
  "in_review",
  "done"
];

export const statusNames: Record<Ticket["status"], string> = {
  in_dev: "In Dev",
  in_test: "In Test",
  in_review: "In Review",
  done: "Done"
};

export type PostsByStatus = Record<Ticket["status"], Ticket[]>;

export const getPostsByStatus = (unorderedPosts: Ticket[]) => {
  const postsByStatus: PostsByStatus = unorderedPosts.reduce(
    (acc, post) => {
      acc[post.status].push(post);
      return acc;
    },
    statuses.reduce(
      (obj, status) => ({ ...obj, [status]: [] }),
      {} as PostsByStatus
    )
  );
  // order each column by index
  statuses.forEach((status) => {
    postsByStatus[status] = postsByStatus[status].sort(
      (recordA: Ticket, recordB: Ticket) => recordA.index - recordB.index
    );
  });
  return postsByStatus;
};