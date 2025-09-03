"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MaternityLeaveCalculator() {
  const [dueDate, setDueDate] = useState("2025-04-30")
  const [monthlySalary, setMonthlySalary] = useState("3000000")
  const [spouseLeave, setSpouseLeave] = useState("yes")

  // 날짜 계산 함수
  const calculateDates = (dueDateStr: string) => {
    const dueDate = new Date(dueDateStr)
    
    // 출산 전 휴가 (45일)
    const beforeLeaveStart = new Date(dueDate)
    beforeLeaveStart.setDate(dueDate.getDate() - 45)
    
    const beforeLeaveEnd = new Date(dueDate)
    beforeLeaveEnd.setDate(dueDate.getDate() - 1)
    
    // 출산 후 휴가 (45일)
    const afterLeaveStart = new Date(dueDate)
    afterLeaveStart.setDate(dueDate.getDate() + 1)
    
    const afterLeaveEnd = new Date(afterLeaveStart)
    afterLeaveEnd.setDate(afterLeaveStart.getDate() + 44)
    
    // 육아 휴직 (365일)
    const childcareStart = new Date(afterLeaveEnd)
    childcareStart.setDate(afterLeaveEnd.getDate() + 1)
    
    const childcareEnd = new Date(childcareStart)
    childcareEnd.setDate(childcareStart.getDate() + 364)
    
    return {
      beforeLeaveStart: beforeLeaveStart.toISOString().split('T')[0],
      beforeLeaveEnd: beforeLeaveEnd.toISOString().split('T')[0],
      afterLeaveStart: afterLeaveStart.toISOString().split('T')[0],
      afterLeaveEnd: afterLeaveEnd.toISOString().split('T')[0],
      childcareStart: childcareStart.toISOString().split('T')[0],
      childcareEnd: childcareEnd.toISOString().split('T')[0]
    }
  }

  const dates = calculateDates(dueDate)

  // 날짜 차이 계산
  const getDaysDifference = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  // 급여 포맷팅
  const formatSalary = (salary: string) => {
    return parseInt(salary).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-balance">출산 휴가, 육아 휴직 계산기</h1>
        </div>

        <Card className="mb-8 shadow-sm">
          <CardContent className="p-6">
            <div className="bg-white rounded-lg border overflow-hidden">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-6 font-semibold bg-gray-50 w-1/3 text-gray-900">출산 예정일</td>
                    <td className="py-4 px-6 bg-red-50 w-2/3">
                      <Input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="border-red-200 focus:border-red-500"
                      />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-6 font-semibold bg-gray-50 w-1/3 text-gray-900">월 급여</td>
                    <td className="py-4 px-6 bg-red-50 w-2/3">
                      <Input
                        type="number"
                        value={monthlySalary}
                        onChange={(e) => setMonthlySalary(e.target.value)}
                        placeholder="월 급여를 입력하세요"
                        className="border-red-200 focus:border-red-500"
                      />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-6 font-semibold bg-gray-50 w-1/3 text-gray-900">배우자 육아 휴직 여부</td>
                    <td className="py-4 px-6 bg-red-50 w-2/3">
                      <Select value={spouseLeave} onValueChange={setSpouseLeave}>
                        <SelectTrigger className="border-red-200 focus:border-red-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">예</SelectItem>
                          <SelectItem value="no">아니오</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-6 font-semibold bg-gray-50 w-1/3 text-gray-900">출산 휴가 기간 (일)</td>
                    <td className="py-4 px-6 bg-red-50 w-2/3 text-gray-900">90</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold bg-gray-50 w-1/3 text-gray-900">육아 휴직 기간 (일)</td>
                    <td className="py-4 px-6 bg-red-50 w-2/3 text-gray-900">365</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="space-y-2 text-sm text-blue-800">
                <p>• 빨간색 출산 예정일을 입력 해 주세요.</p>
                <p>• 빨간색 월급여를 입력 해 주세요.</p>
                <p>• 배우자의 육아 휴직 여부 중 예, 아니오를 선택 해 주세요.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 shadow-sm">
          <CardHeader className="bg-gray-100">
            <CardTitle className="text-xl text-center text-gray-900">출산 전/후 및 휴직 이용하는 경우</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-white rounded-lg border overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="py-3 px-4 text-left font-semibold w-1/4 text-gray-900">구분</th>
                    <th className="py-3 px-4 text-left font-semibold w-1/4 text-gray-900">시작일</th>
                    <th className="py-3 px-4 text-left font-semibold w-1/4 text-gray-900">종료일</th>
                    <th className="py-3 px-4 text-left font-semibold w-1/4 text-gray-900">날짜수</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium text-gray-900">출산 전 휴가</td>
                    <td className="py-3 px-4 text-gray-900">{dates.beforeLeaveStart}</td>
                    <td className="py-3 px-4 text-gray-900">{dates.beforeLeaveEnd}</td>
                    <td className="py-3 px-4 text-gray-900">{getDaysDifference(dates.beforeLeaveStart, dates.beforeLeaveEnd)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium text-gray-900">출산 후 휴가</td>
                    <td className="py-3 px-4 text-gray-900">{dates.afterLeaveStart}</td>
                    <td className="py-3 px-4 text-gray-900">{dates.afterLeaveEnd}</td>
                    <td className="py-3 px-4 text-gray-900">{getDaysDifference(dates.afterLeaveStart, dates.afterLeaveEnd)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-900">육아 휴직</td>
                    <td className="py-3 px-4 text-gray-900">{dates.childcareStart}</td>
                    <td className="py-3 px-4 text-gray-900">{dates.childcareEnd}</td>
                    <td className="py-3 px-4 text-gray-900">{getDaysDifference(dates.childcareStart, dates.childcareEnd)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>• 출산후 45일 확보 필수</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 shadow-sm">
          <CardHeader className="bg-gray-100">
            <CardTitle className="text-xl text-center text-gray-900">출산 전 육아 휴직 이용하는 경우</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-white rounded-lg border overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="py-3 px-4 text-left font-semibold w-1/4 text-gray-900">구분</th>
                    <th className="py-3 px-4 text-left font-semibold w-1/4 text-gray-900">시작일</th>
                    <th className="py-3 px-4 text-left font-semibold w-1/4 text-gray-900">종료일</th>
                    <th className="py-3 px-4 text-left font-semibold w-1/4 text-gray-900">날짜수</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-yellow-50">
                    <td className="py-3 px-4 font-medium text-gray-900">출산 전 육아 휴직</td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      <Input
                        type="date"
                        value={dates.beforeLeaveStart}
                        onChange={(e) => {
                          const newDate = e.target.value
                          setDueDate(new Date(newDate).toISOString().split('T')[0])
                        }}
                        className="border-yellow-200 focus:border-yellow-500"
                      />
                    </td>
                    <td className="py-3 px-4 text-gray-900">{dates.beforeLeaveEnd}</td>
                    <td className="py-3 px-4 text-gray-900">{getDaysDifference(dates.beforeLeaveStart, dates.beforeLeaveEnd)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium text-gray-900">출산 전 휴가</td>
                    <td className="py-3 px-4 text-gray-900">{dates.beforeLeaveStart}</td>
                    <td className="py-3 px-4 text-gray-900">{dates.beforeLeaveEnd}</td>
                    <td className="py-3 px-4 text-gray-900">{getDaysDifference(dates.beforeLeaveStart, dates.beforeLeaveEnd)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium text-gray-900">출산 후 휴가</td>
                    <td className="py-3 px-4 text-gray-900">{dates.afterLeaveStart}</td>
                    <td className="py-3 px-4 text-gray-900">{dates.afterLeaveEnd}</td>
                    <td className="py-3 px-4 text-gray-900">{getDaysDifference(dates.afterLeaveStart, dates.afterLeaveEnd)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-900">출산 후 육아 휴직</td>
                    <td className="py-3 px-4 text-gray-900">{dates.childcareStart}</td>
                    <td className="py-3 px-4 text-gray-900">{dates.childcareEnd}</td>
                    <td className="py-3 px-4 text-gray-900">{getDaysDifference(dates.childcareStart, dates.childcareEnd)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>• 노란색 육아 휴직 시작일을 입력해 주세요.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 shadow-sm">
          <CardHeader className="bg-gray-100">
            <CardTitle className="text-xl text-center text-gray-900">출산 전 휴가 45일 미만 사용 하는 경우</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-white rounded-lg border overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="py-3 px-4 text-left font-semibold w-1/4 text-gray-900">구분</th>
                    <th className="py-3 px-4 text-left font-semibold w-1/4 text-gray-900">시작일</th>
                    <th className="py-3 px-4 text-left font-semibold w-1/4 text-gray-900">종료일</th>
                    <th className="py-3 px-4 text-left font-semibold w-1/4 text-gray-900">날짜수</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-yellow-50">
                    <td className="py-3 px-4 font-medium text-gray-900">출산 전 휴가</td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      <Input
                        type="date"
                        value={dates.beforeLeaveStart}
                        onChange={(e) => {
                          const newDate = e.target.value
                          setDueDate(new Date(newDate).toISOString().split('T')[0])
                        }}
                        className="border-yellow-200 focus:border-yellow-500"
                      />
                    </td>
                    <td className="py-3 px-4 text-gray-900">{dates.beforeLeaveEnd}</td>
                    <td className="py-3 px-4 text-gray-900">{getDaysDifference(dates.beforeLeaveStart, dates.beforeLeaveEnd)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium text-gray-900">출산 후 휴가</td>
                    <td className="py-3 px-4 text-gray-900">{dates.afterLeaveStart}</td>
                    <td className="py-3 px-4 text-gray-900">{dates.afterLeaveEnd}</td>
                    <td className="py-3 px-4 text-gray-900">{getDaysDifference(dates.afterLeaveStart, dates.afterLeaveEnd)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-900">육아 휴직</td>
                    <td className="py-3 px-4 text-gray-900">{dates.childcareStart}</td>
                    <td className="py-3 px-4 text-gray-900">{dates.childcareEnd}</td>
                    <td className="py-3 px-4 text-gray-900">{getDaysDifference(dates.childcareStart, dates.childcareEnd)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>• 노란색 출산 휴가 시작일을 입력해 주세요.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="bg-gray-100">
            <CardTitle className="text-xl text-center text-gray-900">육아 휴직 급여 자동 계산</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-white rounded-lg border overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="py-3 px-4 text-left font-semibold w-1/2 text-gray-900">구분</th>
                    <th className="py-3 px-4 text-left font-semibold w-1/2 text-gray-900">급여</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium text-gray-900">육아휴직 첫 3개월</td>
                    <td className="py-3 px-4 text-gray-900">{formatSalary(monthlySalary)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium text-gray-900">육아휴직 4~6개월</td>
                    <td className="py-3 px-4 text-gray-900">{formatSalary(monthlySalary)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium text-gray-900">육아 휴직 7개월</td>
                    <td className="py-3 px-4 text-gray-900">{Math.floor(parseInt(monthlySalary) * 0.8).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-900">배우자 휴직 인센티브</td>
                    <td className="py-3 px-4 text-gray-900">{spouseLeave === 'yes' ? '500,000' : '0'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>• 100% 지급, 최대 250만원</p>
              <p>• 100% 지급, 최대 200만원</p>
              <p>• 80% 지급, 최대 160만원</p>
              <p>• 배우자도 육아 휴직 중이면 50만원 추가</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
