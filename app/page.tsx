"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MaternityLeaveCalculator() {
  const [dueDate, setDueDate] = useState("2025-04-30")
  const [monthlySalary, setMonthlySalary] = useState("3000000")
  const [spouseLeave, setSpouseLeave] = useState("yes")
  const [afterLeaveDays, setAfterLeaveDays] = useState("45")
  const [totalLeaveDays, setTotalLeaveDays] = useState("90")
  const [childcareDays, setChildcareDays] = useState("365")
  const [preChildcareStartDate, setPreChildcareStartDate] = useState("")

  // 유효성 검사 및 자동 조정
  const validateAndAdjustValues = () => {
    let adjusted = false
    let newAfterLeaveDays = parseInt(afterLeaveDays)
    let newTotalLeaveDays = parseInt(totalLeaveDays)

    // 출산 후 휴가가 총 휴가를 초과하는 경우
    if (newAfterLeaveDays > newTotalLeaveDays) {
      newAfterLeaveDays = newTotalLeaveDays
      setAfterLeaveDays(newAfterLeaveDays.toString())
      adjusted = true
    }

    // 출산 후 휴가가 최소값보다 작은 경우
    if (newAfterLeaveDays < 45) {
      newAfterLeaveDays = 45
      setAfterLeaveDays(newAfterLeaveDays.toString())
      adjusted = true
    }

    // 총 휴가가 최소값보다 작은 경우
    if (newTotalLeaveDays < 45) {
      newTotalLeaveDays = 45
      setTotalLeaveDays(newTotalLeaveDays.toString())
      adjusted = true
    }

    return adjusted
  }

  // 날짜 계산 함수
  const calculateDates = (dueDateStr: string, afterLeaveDaysStr: string, totalLeaveDaysStr: string, childcareDaysStr: string) => {
    const dueDate = new Date(dueDateStr)
    const afterLeaveDays = parseInt(afterLeaveDaysStr)
    const totalLeaveDays = parseInt(totalLeaveDaysStr)
    const childcareDays = parseInt(childcareDaysStr)
    
    // 출산 후 휴가 (사용자 입력값)
    const afterLeaveStart = new Date(dueDate)
    afterLeaveStart.setDate(dueDate.getDate() + 1)
    
    const afterLeaveEnd = new Date(afterLeaveStart)
    afterLeaveEnd.setDate(afterLeaveStart.getDate() + afterLeaveDays - 1)
    
    // 출산 전 휴가 (총 휴가 - 출산 후 휴가)
    const beforeLeaveDays = totalLeaveDays - afterLeaveDays
    
    const beforeLeaveStart = new Date(dueDate)
    beforeLeaveStart.setDate(dueDate.getDate() - beforeLeaveDays)
    
    const beforeLeaveEnd = new Date(dueDate)
    beforeLeaveEnd.setDate(dueDate.getDate() - 1)
    
    // 육아 휴직 (사용자 입력값)
    const childcareStart = new Date(afterLeaveEnd)
    childcareStart.setDate(afterLeaveEnd.getDate() + 1)
    
    const childcareEnd = new Date(childcareStart)
    childcareEnd.setDate(childcareStart.getDate() + childcareDays - 1)
    
    return {
      beforeLeaveStart: beforeLeaveStart.toISOString().split('T')[0],
      beforeLeaveEnd: beforeLeaveEnd.toISOString().split('T')[0],
      afterLeaveStart: afterLeaveStart.toISOString().split('T')[0],
      afterLeaveEnd: afterLeaveEnd.toISOString().split('T')[0],
      childcareStart: childcareStart.toISOString().split('T')[0],
      childcareEnd: childcareEnd.toISOString().split('T')[0],
      beforeLeaveDays,
      afterLeaveDays,
      totalLeaveDays,
      childcareDays
    }
  }

  const dates = calculateDates(dueDate, afterLeaveDays, totalLeaveDays, childcareDays)

  // 출산 전 육아 휴직 날짜 계산
  const calculatePreChildcareDates = () => {
    if (!preChildcareStartDate) return null
    
    const startDate = new Date(preChildcareStartDate)
    const beforeLeaveStart = new Date(dueDate)
    beforeLeaveStart.setDate(new Date(dueDate).getDate() - dates.beforeLeaveDays)
    
    // 출산 전 육아 휴직 종료일 = 출산 전 휴가 시작일 - 1일
    const endDate = new Date(beforeLeaveStart)
    endDate.setDate(beforeLeaveStart.getDate() - 1)
    
    // 기본값일 때는 0일로 설정 (시작일이 출산 전 휴가 시작일과 같을 때)
    if (preChildcareStartDate === beforeLeaveStart.toISOString().split('T')[0]) {
      return {
        startDate: preChildcareStartDate,
        endDate: preChildcareStartDate,
        days: 0
      }
    }
    
    // 날짜수 계산
    const days = getDaysDifference(preChildcareStartDate, endDate.toISOString().split('T')[0])
    
    return {
      startDate: preChildcareStartDate,
      endDate: endDate.toISOString().split('T')[0],
      days: days
    }
  }

  // 날짜 차이 계산
  const getDaysDifference = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const preChildcareDates = calculatePreChildcareDates()

  // 출산 예정일이 변경될 때마다 출산 전 육아 휴직 시작일을 출산 전 휴가 시작일로 자동 업데이트
  useEffect(() => {
    const beforeLeaveStart = new Date(dueDate)
    beforeLeaveStart.setDate(new Date(dueDate).getDate() - dates.beforeLeaveDays)
    setPreChildcareStartDate(beforeLeaveStart.toISOString().split('T')[0])
  }, [dueDate, dates.beforeLeaveDays])

  // 급여 포맷팅
  const formatSalary = (salary: string) => {
    return parseInt(salary).toLocaleString()
  }

  // 육아 휴직 급여 계산
  const calculateChildcareSalary = (baseSalary: number, period: string) => {
    switch (period) {
      case 'first3months':
        // 첫 3개월: 100% 지급, 최대 250만원
        return Math.min(baseSalary, 2500000)
      case '4to6months':
        // 4~6개월: 100% 지급, 최대 200만원
        return Math.min(baseSalary, 2000000)
      case '7months':
        // 7개월: 80% 지급, 최대 160만원
        return Math.min(Math.floor(baseSalary * 0.8), 1600000)
      default:
        return baseSalary
    }
  }

  // 월 급여 입력 처리 (숫자만 허용)
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setMonthlySalary(value)
  }

  // 월 급여 표시용 (천 단위 구분자 포함)
  const displaySalary = monthlySalary ? formatSalary(monthlySalary) : ''

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">
            출산 휴가<br />
            👶 육아 휴직 계산기
          </h1>
        </div>

        {/* 입력 폼 - 모바일 최적화 */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4">
              {/* 출산 예정일 */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="text-sm font-semibold text-gray-900 min-w-[120px]">출산 예정일</Label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 flex-1 transition-colors"
                />
              </div>

              {/* 월 급여 */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="text-sm font-semibold text-gray-900 min-w-[120px]">월 급여</Label>
                <div className="relative flex-1">
                  <Input
                    type="text"
                    value={displaySalary}
                    onChange={handleSalaryChange}
                    placeholder="월 급여를 입력하세요"
                    className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pr-12 transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">원</span>
                </div>
              </div>


              {/* 배우자 육아 휴직 여부 */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="text-sm font-semibold text-gray-900 min-w-[120px]">배우자 육아 휴직 여부</Label>
                <Select value={spouseLeave} onValueChange={setSpouseLeave}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 flex-1 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">예</SelectItem>
                    <SelectItem value="no">아니오</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 출산 후 휴가 기간 */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="text-sm font-semibold text-gray-900 min-w-[120px]">출산 후 휴가 기간</Label>
                <div className="relative flex-1">
                  <Input
                    type="number"
                    value={afterLeaveDays}
                    onChange={(e) => {
                      const value = e.target.value
                      setAfterLeaveDays(value)
                      // 실시간 유효성 검사
                      if (parseInt(value) > parseInt(totalLeaveDays)) {
                        e.target.classList.add('border-red-500', 'ring-2', 'ring-red-200')
                      } else {
                        e.target.classList.remove('border-red-500', 'ring-2', 'ring-red-200')
                      }
                    }}
                    onBlur={() => validateAndAdjustValues()}
                    min="45"
                    max={totalLeaveDays}
                    className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pr-16 transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">일</span>
                </div>
                {parseInt(afterLeaveDays) > parseInt(totalLeaveDays) && (
                  <span className="text-xs text-red-500 mt-1 sm:mt-0">총 휴가 기간을 초과할 수 없습니다</span>
                )}
              </div>


              {/* 기본 정보 */}
              <div className="space-y-4 pt-4 border-t">
                {/* 출산 휴가 정보 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">출산 전 휴가</span>
                    <span className="text-sm font-semibold text-gray-900">{dates.beforeLeaveDays}일</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">출산 후 휴가</span>
                    <span className="text-sm font-semibold text-gray-900">{dates.afterLeaveDays}일</span>
                  </div>
                </div>
                
                {/* 구분선 */}
                <div className="border-t border-gray-200"></div>
                
                {/* 설정 가능한 기간 */}
                <div className="space-y-4">
                  {/* 출산 휴가 */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <Label className="text-sm font-semibold text-gray-900 min-w-[120px]">출산 휴가</Label>
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        value={totalLeaveDays}
                        onChange={(e) => {
                          const value = e.target.value
                          setTotalLeaveDays(value)
                          // 실시간 유효성 검사
                          if (parseInt(value) < parseInt(afterLeaveDays)) {
                            e.target.classList.add('border-red-500', 'ring-2', 'ring-red-200')
                          } else {
                            e.target.classList.remove('border-red-500', 'ring-2', 'ring-red-200')
                          }
                        }}
                        onBlur={() => validateAndAdjustValues()}
                        min="45"
                        max="120"
                        className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pr-16 transition-colors"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">일</span>
                    </div>
                  </div>
                  
                  {/* 육아 휴직 */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <Label className="text-sm font-semibold text-gray-900 min-w-[120px]">육아 휴직</Label>
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        value={childcareDays}
                        onChange={(e) => setChildcareDays(e.target.value)}
                        min="30"
                        max="730"
                        className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pr-16 transition-colors"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">일</span>
                    </div>
                  </div>
                </div>
                {parseInt(totalLeaveDays) < parseInt(afterLeaveDays) && (
                  <div className="text-xs text-red-500 mt-1">총 휴가 기간은 출산 후 휴가 기간보다 커야 합니다</div>
                )}
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="space-y-1 text-xs md:text-sm text-blue-800">
                <p>• 출산 예정일을 입력해 주세요.</p>
                <p>• 월 급여를 입력해 주세요.</p>
                <p>• 배우자의 육아 휴직 여부를 선택해 주세요.</p>
                <p>• 출산 후 휴가 기간을 입력해 주세요 (45일 이상).</p>
                <p>• 육아 휴직 기간을 설정해 주세요 (30일~730일).</p>
                <p>• 출산 전 휴가는 자동으로 계산됩니다 (출산 휴가 - 출산 후 휴가).</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 출산 전/후 및 휴직 이용하는 경우 */}
        <Card className="mb-6 shadow-sm">
          <CardHeader className="bg-gray-100 p-4">
            <CardTitle className="text-lg md:text-xl text-center text-gray-900">📅 출산 휴가 & 육아 휴직</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="py-3 px-1 md:px-2 text-left font-semibold text-xs md:text-sm text-gray-900 w-1/4">구분</th>
                    <th className="py-3 px-1 md:px-2 text-left font-semibold text-xs md:text-sm text-gray-900 w-1/4">시작일</th>
                    <th className="py-3 px-1 md:px-2 text-left font-semibold text-xs md:text-sm text-gray-900 w-1/4">종료일</th>
                    <th className="py-3 px-1 md:px-2 text-left font-semibold text-xs md:text-sm text-gray-900 w-1/4">날짜수</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-1 md:px-2 font-medium text-xs md:text-sm text-gray-900">출산 전 휴가</td>
                    <td className="py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900">{dates.beforeLeaveStart}</td>
                    <td className="py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900">{dates.beforeLeaveEnd}</td>
                    <td className="py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900">{getDaysDifference(dates.beforeLeaveStart, dates.beforeLeaveEnd)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-1 md:px-2 font-medium text-xs md:text-sm text-gray-900">출산 후 휴가</td>
                    <td className="py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900">{dates.afterLeaveStart}</td>
                    <td className="py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900">{dates.afterLeaveEnd}</td>
                    <td className="py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900">{getDaysDifference(dates.afterLeaveStart, dates.afterLeaveEnd)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-1 md:px-2 font-medium text-xs md:text-sm text-gray-900">육아 휴직</td>
                    <td className="py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900">{dates.childcareStart}</td>
                    <td className="py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900">{dates.childcareEnd}</td>
                    <td className="py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900">{dates.childcareDays}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 출산 전 육아 휴직 이용하는 경우 */}
        <Card className="mb-6 shadow-sm">
          <CardHeader className="bg-gray-100 p-4">
            <CardTitle className="text-lg md:text-xl text-center text-gray-900">👶 출산 전 육아 휴직</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="py-3 px-1 md:px-2 text-left font-semibold text-xs md:text-sm text-gray-900 w-2/8">구분</th>
                    <th className="py-3 px-1 md:px-2 text-left font-semibold text-xs md:text-sm text-gray-900 w-3/8">시작일</th>
                    <th className="py-3 px-1 md:px-2 text-left font-semibold text-xs md:text-sm text-gray-900 w-2/8">종료일</th>
                    <th className="py-3 px-1 md:px-2 text-left font-semibold text-xs md:text-sm text-gray-900 w-1/8">날짜수</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-yellow-50">
                    <td className="py-3 px-1 md:px-2 font-medium text-xs md:text-sm text-gray-900">출산 전 육아 휴직</td>
                    <td className="py-3 px-1 md:px-2 font-medium text-xs md:text-sm text-gray-900">
                      <Input
                        type="date"
                        value={preChildcareStartDate}
                        onChange={(e) => setPreChildcareStartDate(e.target.value)}
                        className="border-yellow-200 focus:border-yellow-500 text-xs"

                      />
                    </td>
                    <td className="py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900">
                      {preChildcareDates ? preChildcareDates.endDate : '-'}
                    </td>
                    <td className="py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900">
                      {preChildcareDates ? preChildcareDates.days : '-'}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-1 md:px-2 font-medium text-xs md:text-sm text-gray-900">출산 전 휴가</td>
                    <td className="py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900">{dates.beforeLeaveStart}</td>
                    <td className="py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900">{dates.beforeLeaveEnd}</td>
                    <td className="py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900">{getDaysDifference(dates.beforeLeaveStart, dates.beforeLeaveEnd)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-1 md:px-2 font-medium text-xs md:text-sm text-gray-900">출산 후 휴가</td>
                    <td className="py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900">{dates.afterLeaveStart}</td>
                    <td className="py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900">{dates.afterLeaveEnd}</td>
                    <td className="py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900">{getDaysDifference(dates.afterLeaveStart, dates.afterLeaveEnd)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-1 md:px-2 font-medium text-xs md:text-sm text-gray-900">출산 후 육아 휴직</td>
                    <td className="py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900">{dates.childcareStart}</td>
                    <td className="py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900">{dates.childcareEnd}</td>
                    <td className="py-3 px-1 md:px-2 text-xs md:text-sm text-gray-900">
                      {preChildcareDates ? 365 - preChildcareDates.days : 365}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 space-y-1 text-sm md:text-base text-gray-600">
              <p>• 노란색 육아 휴직 시작일을 입력해 주세요.</p>
            </div>
          </CardContent>
        </Card>
        {/* 육아 휴직 급여 자동 계산 */}
        <Card className="shadow-sm">
          <CardHeader className="bg-gray-100 p-4">
            <CardTitle className="text-lg md:text-xl text-center text-gray-900">💰 육아 휴직 급여 계산</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="py-3 px-1 md:px-2 text-left font-semibold text-sm md:text-base text-gray-900 w-1/2">구분</th>
                    <th className="py-3 px-1 md:px-2 text-left font-semibold text-sm md:text-base text-gray-900 w-1/2">급여</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-1 md:px-2 font-medium text-sm md:text-base text-gray-900">육아휴직 첫 3개월</td>
                    <td className="py-3 px-1 md:px-2 text-sm md:text-base text-gray-900">
                      {monthlySalary ? formatSalary(calculateChildcareSalary(parseInt(monthlySalary), 'first3months').toString()) : '0'}원
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-1 md:px-2 font-medium text-sm md:text-base text-gray-900">육아휴직 4~6개월</td>
                    <td className="py-3 px-1 md:px-2 text-sm md:text-base text-gray-900">
                      {monthlySalary ? formatSalary(calculateChildcareSalary(parseInt(monthlySalary), '4to6months').toString()) : '0'}원
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-1 md:px-2 font-medium text-sm md:text-base text-gray-900">육아 휴직 7개월</td>
                    <td className="py-3 px-1 md:px-2 text-sm md:text-base text-gray-900">
                      {monthlySalary ? formatSalary(calculateChildcareSalary(parseInt(monthlySalary), '7months').toString()) : '0'}원
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-1 md:px-2 font-medium text-sm md:text-base text-gray-900">배우자 휴직 인센티브</td>
                    <td className="py-3 px-1 md:px-2 text-sm md:text-base text-gray-900">
                      {spouseLeave === 'yes' ? '500,000' : '0'}원
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 space-y-1 text-sm md:text-base text-gray-600">
              <p>• 100% 지급, 최대 250만원</p>
              <p>• 100% 지급, 최대 200만원</p>
              <p>• 80% 지급, 최대 160만원</p>
              <p>• 배우자도 육아 휴직 중이면 50만원 추가</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            © 2025 출산 휴가 & 육아 휴직 계산기. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Made with ❤️ by <span className="font-medium text-gray-700">ggumi</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
