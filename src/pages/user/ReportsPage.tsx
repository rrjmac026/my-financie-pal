import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { categorySpending, weeklySpending, monthlySpending, formatCurrency } from '@/lib/mockData';
import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts';

export default function ReportsPage() {
  const totalSpent = categorySpending.reduce((s, c) => s + c.value, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-display">Reports & Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Visualize your spending patterns</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Expenses by Category</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categorySpending} cx="50%" cy="50%" outerRadius={100} innerRadius={55} dataKey="value" paddingAngle={2} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {categorySpending.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-2">
              <p className="text-sm text-muted-foreground">Total: <strong className="text-foreground">{formatCurrency(totalSpent)}</strong></p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Weekly Spending Trend</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklySpending}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₱${v / 1000}k`} />
                  <Tooltip formatter={(value: number) => [formatCurrency(value), 'Spent']} />
                  <Line type="monotone" dataKey="amount" stroke="hsl(191, 56%, 40%)" strokeWidth={2.5} dot={{ fill: 'hsl(191, 56%, 40%)', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Monthly Comparison</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySpending}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₱${v / 1000}k`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="current" name="This Period" fill="hsl(191, 56%, 40%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="previous" name="Previous Period" fill="hsl(178, 38%, 55%)" radius={[4, 4, 0, 0]} opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Category Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categorySpending.sort((a, b) => b.value - a.value).map(cat => {
                const pct = (cat.value / totalSpent) * 100;
                return (
                  <div key={cat.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm w-36 shrink-0">{cat.name}</span>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
                    </div>
                    <span className="text-sm font-medium w-24 text-right">{formatCurrency(cat.value)}</span>
                    <span className="text-xs text-muted-foreground w-12 text-right">{pct.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
