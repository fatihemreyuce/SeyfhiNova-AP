import { useDashboard } from "@/hooks/use-analytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Eye,
  TrendingUp,
  TrendingDown,
  Activity,
  MousePointerClick,
  FileText,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Calendar,
  Globe,
  RefreshCw,
  Zap,
  Layers,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { dashboard } from "@/types/analytics.types";

export default function DashboardPage() {
  const { data, isLoading, refetch } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
            <Activity className="absolute inset-0 m-auto h-6 w-6 text-primary opacity-50" />
          </div>
          <p className="text-muted-foreground dark:text-foreground/70">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  const dashboardData: dashboard | undefined = data;

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-24 h-24 rounded-full bg-muted/30 flex items-center justify-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground opacity-50" />
          </div>
          <div>
            <h3 className="text-lg font-semibold dark:text-foreground">Veri bulunamadı</h3>
            <p className="text-sm text-muted-foreground dark:text-foreground/70 mt-1">
              Dashboard verileri şu anda mevcut değil
            </p>
          </div>
        </div>
      </div>
    );
  }

  const percentageChange = dashboardData.percentageChange || 0;
  const isPositive = percentageChange >= 0;

  // Son 7 günü her zaman doldur; API'den gelen veriyi tarihe göre eşleştir, yoksa 0
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const statsByDate =
    dashboardData.dailyStats && Array.isArray(dashboardData.dailyStats)
      ? Object.fromEntries(
          dashboardData.dailyStats.map((s) => [
            new Date(s.date).toISOString().slice(0, 10),
            { uniqueVisitors: s.uniqueVisitors, totalPageViews: s.totalPageViews, avgPagesPerVisitor: s.avgPagesPerVisitor },
          ])
        )
      : {};
  const dailyStatsData = last7Days.map((dateStr) => {
    const stat = statsByDate[dateStr];
    const dateLabel = new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
    });
    return {
      date: dateLabel,
      dateStr,
      ziyaretçiler: stat?.uniqueVisitors ?? 0,
      görüntülenme: stat?.totalPageViews ?? 0,
      ortalama: stat ? parseFloat(stat.avgPagesPerVisitor.toFixed(1)) : 0,
    };
  });

  // Chart configurations
  const areaChartConfig = {
    ziyaretçiler: {
      label: "Benzersiz Ziyaretçiler",
      color: "hsl(var(--chart-1))",
    },
    görüntülenme: {
      label: "Sayfa Görüntülemeleri",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground dark:text-foreground/70 mt-1">
            Analitik verilerinizi görüntüleyin ve izleyin
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <RefreshCw className="h-4 w-4 text-primary" />
          Yenile
        </button>
      </div>

      {/* Main Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Aktif Ziyaretçiler */}
        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Ziyaretçiler</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold dark:text-foreground mb-1">
              {dashboardData.activeVisitors.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Zap className="h-3 w-3 text-yellow-500" />
              <span>Şu anda aktif</span>
            </div>
          </CardContent>
        </Card>

        {/* Bugünün Benzersiz Ziyaretçileri */}
        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bugünün Ziyaretçileri</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold dark:text-foreground mb-1">
              {dashboardData.todayUniqueVisitors.toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              {isPositive ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    +{Math.abs(percentageChange).toFixed(1)}%
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-red-500" />
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                    {Math.abs(percentageChange).toFixed(1)}%
                  </span>
                </>
              )}
              <span className="text-xs text-muted-foreground">dün ile karşılaştırıldığında</span>
            </div>
          </CardContent>
        </Card>

        {/* Bugünün Sayfa Görüntülemeleri */}
        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bugünün Görüntülemeleri</CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Eye className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold dark:text-foreground mb-1">
              {dashboardData.todayPageViews.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Layers className="h-3 w-3 text-purple-500" />
              <span>Dün: {dashboardData.yesterdayPageViews.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* İletişim Formu */}
        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">İletişim Formu</CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10">
              <Target className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold dark:text-foreground mb-1">
              {dashboardData.conversionStats?.totalVisitors > 0
                ? (dashboardData.conversionStats.totalContactForms / dashboardData.conversionStats.totalVisitors * 100).toFixed(2)
                : "0.00"}%
            </div>
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <MousePointerClick className="h-3 w-3 text-green-500" />
                <span>
                  {dashboardData.conversionStats?.totalContactForms || 0} form gönderimi
                </span>
              </div>
              {dashboardData.conversionStats?.totalVisitors === 0 && dashboardData.conversionStats?.totalContactForms > 0 && (
                <span className="text-xs text-orange-600 dark:text-orange-400 italic">
                  Henüz ziyaretçi verisi toplanmamış
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Stats Area Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle>7 Günlük İstatistikler</CardTitle>
                  <CardDescription className="mt-1">
                    Ziyaretçi ve görüntülenme trendleri
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="gap-2">
                <Calendar className="h-3 w-3 text-blue-500" />
                Son 7 Gün
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[400px] min-w-0 min-h-0" style={{ position: "relative" }}>
              <ChartContainer config={areaChartConfig} className="w-full h-full">
                <AreaChart
                  data={dailyStatsData}
                  margin={{ top: 12, right: 12, bottom: 8, left: 8 }}
                >
                  <defs>
                    <linearGradient id="fillZiyaretçiler" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--color-ziyaretçiler)"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-ziyaretçiler)"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                    <linearGradient id="fillGörüntülenme" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--color-görüntülenme)"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-görüntülenme)"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    className="text-xs font-medium"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tickFormatter={(value) => value.toLocaleString()}
                    className="text-xs"
                    domain={[0, "auto"]}
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={(props: any) => <ChartLegendContent payload={props.payload} verticalAlign={props.verticalAlign} />} />
                  <Area
                    type="monotone"
                    dataKey="ziyaretçiler"
                    stroke="var(--color-ziyaretçiler)"
                    fill="url(#fillZiyaretçiler)"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "var(--color-ziyaretçiler)", strokeWidth: 2, stroke: "hsl(var(--background))" }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                    connectNulls
                  />
                  <Area
                    type="monotone"
                    dataKey="görüntülenme"
                    stroke="var(--color-görüntülenme)"
                    fill="url(#fillGörüntülenme)"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "var(--color-görüntülenme)", strokeWidth: 2, stroke: "hsl(var(--background))" }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                    connectNulls
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Pages Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Globe className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <CardTitle>En Çok Ziyaret Edilen Sayfalar</CardTitle>
                <CardDescription className="mt-1">Top 5 sayfa performansı</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {dashboardData.topPages && dashboardData.topPages.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>Sayfa</TableHead>
                      <TableHead className="text-right">Görüntülenme</TableHead>
                      <TableHead className="text-right">Benzersiz</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.topPages.slice(0, 5).map((page, index) => (
                      <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <Badge
                            variant={index === 0 ? "default" : "outline"}
                            className="w-8 h-8 flex items-center justify-center p-0 text-xs font-semibold"
                          >
                            {index + 1}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium dark:text-foreground">
                          <div className="flex items-center gap-2 max-w-[250px]">
                            <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            <span className="truncate">{page.pagePath || "/"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right dark:text-foreground/80 font-medium">
                          {page.viewCount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right dark:text-foreground/80 font-medium">
                          {page.uniqueVisitors.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Globe className="h-12 w-12 text-orange-500 mb-4 opacity-50" />
                <p className="text-sm text-muted-foreground dark:text-foreground/50">
                  Henüz sayfa verisi bulunmamaktadır
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conversion Stats */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <MousePointerClick className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <CardTitle>İletişim Formu</CardTitle>
                <CardDescription className="mt-1">Form gönderim performansı</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {dashboardData.conversionStats ? (
              <div className="space-y-6">
                {/* Conversion Rate Circle */}
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative w-32 h-32">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(dashboardData.conversionStats.conversionRate / 100) * 351.86} 351.86`}
                        className="text-green-500 transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold dark:text-foreground">
                          {dashboardData.conversionStats.conversionRate.toFixed(2)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Dönüşüm</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 p-3 rounded-lg border bg-muted/30">
                    <div className="text-xs text-muted-foreground">Toplam Ziyaretçi</div>
                    <div className="text-xl font-bold dark:text-foreground">
                      {dashboardData.conversionStats.totalVisitors.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-1 p-3 rounded-lg border bg-muted/30">
                    <div className="text-xs text-muted-foreground">Toplam Form</div>
                    <div className="text-xl font-bold dark:text-foreground">
                      {dashboardData.conversionStats.totalContactForms.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Today vs Yesterday */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2 p-3 rounded-lg border bg-green-500/5 border-green-500/20">
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">
                        Bugün
                      </span>
                    </div>
                    <div className="text-2xl font-bold dark:text-foreground">
                      {dashboardData.conversionStats.todayContactForms.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-2 p-3 rounded-lg border bg-blue-500/5 border-blue-500/20">
                    <div className="flex items-center gap-2">
                      <ArrowDownRight className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        Dün
                      </span>
                    </div>
                    <div className="text-2xl font-bold dark:text-foreground">
                      {dashboardData.conversionStats.yesterdayContactForms.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Target className="h-12 w-12 text-green-500 mb-4 opacity-50" />
                <p className="text-sm text-muted-foreground dark:text-foreground/50">
                  Dönüşüm verisi bulunmamaktadır
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
