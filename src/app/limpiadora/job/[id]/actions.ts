"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function finishJobAction({ 
  jobId, 
  notes, 
  signatureUrl 
}: { 
  jobId: string, 
  notes: string, 
  signatureUrl: string 
}) {
  await prisma.job.update({
    where: { id: jobId },
    data: {
      status: "COMPLETED",
      endTime: new Date(),
      notes,
      signatureUrl
    }
  });

  redirect("/personal");
}
