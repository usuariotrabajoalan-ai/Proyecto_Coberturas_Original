import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const selectedMonth = searchParams.get("month"); 
  const selectedYear = searchParams.get("year");
  const userId = searchParams.get("userId");

  if (!selectedMonth || !selectedYear || userId === null) {
    return new NextResponse("Missing parameters", { status: 400 });
  }

  const year = Number(selectedYear);
  const month = Number(selectedMonth);
  
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const whereClause: { status: string; date: { gte: Date; lte: Date }; userId?: string } = {
    status: "COMPLETED",
    date: {
      gte: startDate,
      lte: endDate
    }
  };

  if (userId && userId !== "all") {
    whereClause.userId = userId;
  }

  const jobs = await prisma.job.findMany({
    where: whereClause,
    include: { location: true, user: true },
    orderBy: [
      { date: 'asc' },
      { startTime: 'asc' }
    ]
  });

  const isGeneralReport = !userId || userId === "all";
  const employeeName = isGeneralReport ? "General" : (jobs.length > 0 ? jobs[0].user.name : "Personal");

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Reporte Mensual");

  // Add Headers
  worksheet.columns = [
    { header: 'Fecha del Evento', key: 'date', width: 20 },
    { header: 'Lugar (Quincho/Salón)', key: 'location', width: 25 },
    { header: 'Personal Asignado', key: 'personal', width: 30 },
    { header: 'Hora y Fecha de Finalización', key: 'endTime', width: 30 },
    { header: 'Observaciones', key: 'notes', width: 40 },
  ];

  // Style Headers
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } }; // slate-900
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  // Add Data
  jobs.forEach(job => {
    worksheet.addRow({
      date: job.date.toLocaleDateString('es-ES'),
      location: job.location.name,
      personal: job.user.name,
      endTime: job.endTime ? job.endTime.toLocaleString('es-ES') : "No registrado",
      notes: job.notes || "Sin observaciones",
    });
  });

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();

  const filename = `Reporte_${employeeName.replace(/\s+/g, '_')}_${selectedYear}-${selectedMonth}.xlsx`;

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  });
}
