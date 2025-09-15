"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function MaternityLeaveCalculator() {
  const [dueDate, setDueDate] = useState(() => {
    const today = new Date()
    const threeMonthsLater = new Date(today)
    threeMonthsLater.setMonth(today.getMonth() + 3)
    return threeMonthsLater.toISOString().split("T")[0]
  })
  const [monthlySalary, setMonthlySalary] = useState("3000000")
  const [totalLeaveDays, setTotalLeaveDays] = useState("90")
  const [childcareDays, setChildcareDays] = useState("365")
  const [leaveStartDate, setLeaveStartDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  })
  const [leaveStartEdited, setLeaveStartEdited] = useState(false)
  
  // UPDATED: 통합된 오류 메시지 상태
  const [startDateError, setStartDateError] = useState("")

  const [leaveSchedule, setLeaveSchedule] = useState({
    preChildcare: { start: "", end: "", days: 0 },
    preMaternity: { start: "", end: "", days: 0 },
    postMaternity: { start: "", end: "", days: 0 },
    postChildcare: { start: "", end: "", days: 0 },
  })

  // --- CALCULATION LOGIC ---
  const calculateAllDates = (
    dueDateStr: string,
    overallStartDateStr: string,
    totalMaternityStr: string,
    totalChildcareStr: string
  ) => {
    // Helper functions
    const parseDate = (dateStr: string) => new Date(dateStr + "T00:00:00")
    const formatDate = (date: Date) => date.toISOString().split("T")[0]
    const addDays = (date: Date, days: number) => {
      const result = new Date(date)
      result.setDate(result.getDate() + days)
      return result
    }
    const getDaysDiff = (start: Date, end: Date) => {
      if (!start || !end || start > end) return 0
      const diffTime = end.getTime() - start.getTime()
      return Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1
    }

    const dueDate = parseDate(dueDateStr)
    const overallStartDate = parseDate(overallStartDateStr)
    const totalMaternityDays = parseInt(totalMaternityStr) || 0
    const totalChildcareDays = parseInt(totalChildcareStr) || 0

    // NEW: Validation for start date being after due date
    if (overallStartDate > dueDate) {
      setStartDateError("휴가 시작일은 출산 예정일보다 늦을 수 없습니다.")
      // Return a predictable state on error
      return { ...leaveSchedule }
    }

    // --- Core Rule Implementation ---
    const minPostMaternityDays = 45
    const preMaternityEnd = dueDate
    const maxPreMaternityDays = Math.max(0, totalMaternityDays - minPostMaternityDays)
    const earliestMaternityStartDate = addDays(preMaternityEnd, -(maxPreMaternityDays > 0 ? maxPreMaternityDays - 1 : 0))

    let preMaternityStart: Date, preChildcareStart: Date, preChildcareEnd: Date
    let preChildcareDays = 0

    if (overallStartDate < earliestMaternityStartDate) {
      preChildcareStart = overallStartDate
      preChildcareEnd = addDays(earliestMaternityStartDate, -1)
      preChildcareDays = getDaysDiff(preChildcareStart, preChildcareEnd)
      preMaternityStart = earliestMaternityStartDate
    } else {
      preChildcareDays = 0
      preChildcareStart = overallStartDate
      preChildcareEnd = addDays(overallStartDate, -1)
      preMaternityStart = overallStartDate
    }
    
    const preMaternityDays = getDaysDiff(preMaternityStart, preMaternityEnd)
    const postMaternityDays = totalMaternityDays - preMaternityDays
    
    // UPDATED: Combined validation check
    if (postMaternityDays < minPostMaternityDays) {
      setStartDateError("시작일 지정으로 출산 후 휴가가 45일 미만이 됩니다.")
    } else {
      setStartDateError("") // Clear error if valid
    }
    
    const postMaternityStart = addDays(dueDate, 1)
    const postMaternityEnd = addDays(postMaternityStart, postMaternityDays > 0 ? postMaternityDays - 1 : 0)
    
    const postChildcareDays = Math.max(0, totalChildcareDays - preChildcareDays)
    const postChildcareStart = addDays(postMaternityEnd, 1)
    const postChildcareEnd = addDays(postChildcareStart, postChildcareDays > 0 ? postChildcareDays - 1 : 0)

    return {
      preChildcare: {
        start: preChildcareDays > 0 ? formatDate(preChildcareStart) : "-",
        end: preChildcareDays > 0 ? formatDate(preChildcareEnd) : "-",
        days: preChildcareDays,
      },
      preMaternity: {
        start: formatDate(preMaternityStart),
        end: formatDate(preMaternityEnd),
        days: preMaternityDays,
      },
      postMaternity: {
        start: formatDate(postMaternityStart),
        end: formatDate(postMaternityEnd),
        days: postMaternityDays,
      },
      postChildcare: {
        start: postChildcareDays > 0 ? formatDate(postChildcareStart) : "-",
        end: postChildcareDays > 0 ? formatDate(postChildcareEnd) : "-",
        days: postChildcareDays,
      },
    }
  }

  // Effect to set the default leave start date
  useEffect(() => {
    if (leaveStartEdited) return
    const dueDateObj = new Date(dueDate + "T00:00:00")
    const totalDays = parseInt(totalLeaveDays) || 90
    const preDays = Math.max(0, totalDays - 45)
    const preMaternityEnd = new Date(dueDateObj)
    let preMaternityStart = new Date(preMaternityEnd)
    if (preDays > 0) {
        preMaternityStart.setDate(preMaternityStart.getDate() - (preDays - 1))
    }
    setLeaveStartDate(preMaternityStart.toISOString().split("T")[0])
  }, [dueDate, totalLeaveDays, leaveStartEdited])
  
  // Main effect to recalculate the schedule
  useEffect(() => {
    if (!dueDate || !leaveStartDate) return
    const schedule = calculateAllDates(dueDate, leaveStartDate, totalLeaveDays, childcareDays)
    setLeaveSchedule(schedule)
  }, [dueDate, leaveStartDate, totalLeaveDays, childcareDays])

  // --- Handlers & Utils ---
  const validateAndAdjustValues = () => { if (parseInt(totalLeaveDays) < 45) setTotalLeaveDays("45") }
  const formatSalary = (salary: string) => parseInt(salary).toLocaleString()
  const calculateChildcareSalary = (baseSalary: number, period: string) => {
    switch (period) {
      case 'first3months': return Math.min(baseSalary, 2500000);
      case '4to6months': return Math.min(baseSalary, 2000000);
      case '7months': return Math.min(Math.floor(baseSalary * 0.8), 1600000);
      default: return baseSalary;
    }
  }
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setMonthlySalary(value)
  }
  const displaySalary = monthlySalary ? formatSalary(monthlySalary) : ""
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">
            👶 육아 휴직 계산기
          </h1>
        </div>
        <Card className="mb-6 shadow-sm">
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4">
              {/* UPDATED: UI Grouping */}
              <h3 className="text-md font-semibold text-gray-800">기본 정보</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <Label className="text-sm font-semibold text-gray-900 min-w-[120px]">출산 예정일</Label>
                  <div className="flex-1">
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    />
                  </div>
                </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="text-sm font-semibold text-gray-900 min-w-[120px]">월 급여</Label>
                <div className="relative flex-1">
                  <Input type="text" value={displaySalary} onChange={handleSalaryChange} placeholder="월 급여를 입력하세요" className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pr-12 transition-colors" />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">원</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="text-sm font-semibold text-gray-900 min-w-[120px]">휴가 시작일</Label>
                <div className="flex-1">
                  <Input type="date" value={leaveStartDate} onChange={(e) => { setLeaveStartDate(e.target.value); setLeaveStartEdited(true); }} className={`border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors ${startDateError ? 'border-red-500 ring-2 ring-red-200' : ''}`} />
                </div>
              </div>
              {startDateError && <div className="text-xs text-red-500 sm:ml-[136px]">{startDateError}</div>}

              {/* UPDATED: UI Grouping */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-md font-semibold text-gray-800">기간 설정</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <Label className="text-sm font-semibold text-gray-900 min-w-[120px]">출산 휴가</Label>
                  <div className="relative flex-1">
                    <Input type="number" value={totalLeaveDays} onChange={(e) => setTotalLeaveDays(e.target.value)} onBlur={validateAndAdjustValues} min="45" max="120" className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pr-16 transition-colors" />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">일</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <Label className="text-sm font-semibold text-gray-900 min-w-[120px]">육아 휴직</Label>
                  <div className="relative flex-1">
                    <Input type="number" value={childcareDays} onChange={(e) => setChildcareDays(e.target.value)} min="0" className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pr-16 transition-colors" />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">일</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Result tables are the same */}
        <Card className="mb-6 shadow-sm">
          <CardHeader className="bg-gray-100 p-4"><CardTitle className="text-lg md:text-xl text-center text-gray-900">🗓️ 휴가 기간 상세</CardTitle></CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="py-3 px-1 md:px-2 text-left font-semibold text-sm text-gray-900 w-2/8">구분</th>
                    <th className="py-3 px-1 md:px-2 text-left font-semibold text-sm text-gray-900 w-3/8">시작일</th>
                    <th className="py-3 px-1 md:px-2 text-left font-semibold text-sm text-gray-900 w-2/8">종료일</th>
                    <th className="py-3 px-1 md:px-2 text-left font-semibold text-sm text-gray-900 w-1/8">일수</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-yellow-50">
                    <td className="py-3 px-1 md:px-2 font-medium text-sm text-gray-900">출산 전 육아 휴직</td>
                    <td className="py-3 px-1 md:px-2 font-medium text-sm text-gray-900">{leaveSchedule.preChildcare.start}</td>
                    <td className="py-3 px-1 md:px-2 text-sm text-gray-900">{leaveSchedule.preChildcare.end}</td>
                    <td className="py-3 px-1 md:px-2 text-sm text-gray-900">{leaveSchedule.preChildcare.days}일</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-1 md:px-2 font-medium text-sm text-gray-900">출산 전 휴가</td>
                    <td className="py-3 px-1 md:px-2 text-sm text-gray-900">{leaveSchedule.preMaternity.start}</td>
                    <td className="py-3 px-1 md:px-2 text-sm text-gray-900">{leaveSchedule.preMaternity.end}</td>
                    <td className="py-3 px-1 md:px-2 text-sm text-gray-900">{leaveSchedule.preMaternity.days}일</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-1 md:px-2 font-medium text-sm text-gray-900">출산 후 휴가</td>
                    <td className="py-3 px-1 md:px-2 text-sm text-gray-900">{leaveSchedule.postMaternity.start}</td>
                    <td className="py-3 px-1 md:px-2 text-sm text-gray-900">{leaveSchedule.postMaternity.end}</td>
                    <td className="py-3 px-1 md:px-2 text-sm text-gray-900">{leaveSchedule.postMaternity.days}일</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-1 md:px-2 font-medium text-sm text-gray-900">출산 후 육아 휴직</td>
                    <td className="py-3 px-1 md:px-2 text-sm text-gray-900">{leaveSchedule.postChildcare.start}</td>
                    <td className="py-3 px-1 md:px-2 text-sm text-gray-900">{leaveSchedule.postChildcare.end}</td>
                    <td className="py-3 px-1 md:px-2 text-sm text-gray-900">{leaveSchedule.postChildcare.days}일</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="bg-gray-100 p-4"><CardTitle className="text-lg md:text-xl text-center text-gray-900">💰 육아 휴직 급여 계산</CardTitle></CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="py-3 px-1 md:px-2 text-left font-semibold text-sm text-gray-900 w-1/2">구분</th>
                    <th className="py-3 px-1 md:px-2 text-left font-semibold text-sm text-gray-900 w-1/2">급여 (월)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b"><td className="py-3 px-1 md:px-2 font-medium text-sm text-gray-900">육아휴직 첫 3개월</td><td className="py-3 px-1 md:px-2 text-sm text-gray-900">{monthlySalary ? formatSalary(calculateChildcareSalary(parseInt(monthlySalary), 'first3months').toString()) : '0'}원</td></tr>
                  <tr className="border-b"><td className="py-3 px-1 md:px-2 font-medium text-sm text-gray-900">육아휴직 4~6개월</td><td className="py-3 px-1 md:px-2 text-sm text-gray-900">{monthlySalary ? formatSalary(calculateChildcareSalary(parseInt(monthlySalary), '4to6months').toString()) : '0'}원</td></tr>
                  <tr className="border-b"><td className="py-3 px-1 md:px-2 font-medium text-sm text-gray-900">육아 휴직 7개월~</td><td className="py-3 px-1 md:px-2 text-sm text-gray-900">{monthlySalary ? formatSalary(calculateChildcareSalary(parseInt(monthlySalary), '7months').toString()) : '0'}원</td></tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 space-y-1 text-sm text-gray-600">
              <p>• <b>첫 3개월:</b> 통상임금 100% (상한 250만원)</p>
              <p>• <b>4~6개월:</b> 통상임금 100% (상한 200만원)</p>
              <p>• <b>7개월~:</b> 통상임금 80% (상한 160만원)</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <footer className="mt-12 py-6 border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">© 2025 출산 휴가 & 육아 휴직 계산기. All rights reserved.</p>
          <p className="text-xs text-gray-500 mt-1">Made with ❤️ by <span className="font-medium text-gray-700">ggumi</span></p>
        </div>
      </footer>
    </div>
  )
}