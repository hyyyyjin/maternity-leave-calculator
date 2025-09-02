import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MaternityLeaveCalculator() {
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
                    <td className="py-4 px-6 bg-red-50 font-semibold text-red-700 w-2/3">2025-04-30</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-6 font-semibold bg-gray-50 w-1/3 text-gray-900">월 급여</td>
                    <td className="py-4 px-6 bg-red-50 font-semibold text-red-700 w-2/3">3,000,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-6 font-semibold bg-gray-50 w-1/3 text-gray-900">배우자 육아 휴직 여부</td>
                    <td className="py-4 px-6 bg-red-50 w-2/3 text-gray-900">예</td>
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
                    <td className="py-3 px-4 text-gray-900">2025-03-17</td>
                    <td className="py-3 px-4 text-gray-900">2025-04-30</td>
                    <td className="py-3 px-4 text-gray-900">45</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium text-gray-900">출산 후 휴가</td>
                    <td className="py-3 px-4 text-gray-900">2025-05-01</td>
                    <td className="py-3 px-4 text-gray-900">2025-06-14</td>
                    <td className="py-3 px-4 text-gray-900">45</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-900">육아 휴직</td>
                    <td className="py-3 px-4 text-gray-900">2025-06-15</td>
                    <td className="py-3 px-4 text-gray-900">2026-06-14</td>
                    <td className="py-3 px-4 text-gray-900">365</td>
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
                    <td className="py-3 px-4 font-medium text-gray-900">2025-01-01</td>
                    <td className="py-3 px-4 text-gray-900">2025-03-16</td>
                    <td className="py-3 px-4 text-gray-900">75</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium text-gray-900">출산 전 휴가</td>
                    <td className="py-3 px-4 text-gray-900">2025-03-17</td>
                    <td className="py-3 px-4 text-gray-900">2025-04-30</td>
                    <td className="py-3 px-4 text-gray-900">45</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium text-gray-900">출산 후 휴가</td>
                    <td className="py-3 px-4 text-gray-900">2025-05-01</td>
                    <td className="py-3 px-4 text-gray-900">2025-06-14</td>
                    <td className="py-3 px-4 text-gray-900">45</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-900">출산 후 육아 휴직</td>
                    <td className="py-3 px-4 text-gray-900">2025-06-15</td>
                    <td className="py-3 px-4 text-gray-900">2026-03-31</td>
                    <td className="py-3 px-4 text-gray-900">290</td>
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
                    <td className="py-3 px-4 font-medium text-gray-900">2025-04-15</td>
                    <td className="py-3 px-4 text-gray-900">2025-04-30</td>
                    <td className="py-3 px-4 text-gray-900">16</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium text-gray-900">출산 후 휴가</td>
                    <td className="py-3 px-4 text-gray-900">2025-05-01</td>
                    <td className="py-3 px-4 text-gray-900">2025-07-13</td>
                    <td className="py-3 px-4 text-gray-900">74</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-900">육아 휴직</td>
                    <td className="py-3 px-4 text-gray-900">2025-07-14</td>
                    <td className="py-3 px-4 text-gray-900">2026-07-13</td>
                    <td className="py-3 px-4 text-gray-900">365</td>
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
                    <td className="py-3 px-4 text-gray-900">2,500,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium text-gray-900">육아휴직 4~6개월</td>
                    <td className="py-3 px-4 text-gray-900">2,000,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium text-gray-900">육아 휴직 7개월</td>
                    <td className="py-3 px-4 text-gray-900">1,600,000</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-900">배우자 휴직 인센티브</td>
                    <td className="py-3 px-4 text-gray-900">500,000</td>
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
