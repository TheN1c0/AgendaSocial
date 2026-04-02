import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Spinner } from '../../components/ui/Spinner';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, BarChart, Bar } from 'recharts';
import { useCasosPorEstado, useCasosPorMes, useCasosPorTipo } from '../../hooks/useEstadisticas';

const COLORS_ESTADO = ['#C97A8A', '#8C4A5A', '#F7E8EC', '#6B7280'];

export const DashboardPage = () => {
  // Fetch dashboard stats
  const { data: stats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardService.getStats,
  });

  const kpis = stats?.kpis || [];
  const ultimosCasos = stats?.ultimosCasos || [];
  const actividad = stats?.actividad || [];

  const { data: dataEstado, isLoading: loadEstado, isError: errEstado } = useCasosPorEstado();
  const { data: dataMes, isLoading: loadMes, isError: errMes } = useCasosPorMes();
  const { data: dataTipo, isLoading: loadTipo, isError: errTipo } = useCasosPorTipo();

  useEffect(() => {
    document.title = 'Inicio | Agenda Social';
  }, []);

  const renderContent = (isLoading: boolean, isError: boolean, renderChart: () => React.ReactNode) => {
    if (isLoading) return <div className="h-[240px] flex items-center justify-center"><Spinner /></div>;
    if (isError) return <div className="h-[240px] flex items-center justify-center text-sm text-gray-500">No se pudieron cargar los datos.</div>;
    return renderChart();
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-[1600px] mx-auto">
      
      {/* HEADER / TOOLBAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 m-0">
          Panel Administrativo <span className="text-gray-400 font-normal">- Visión General</span>
        </h1>
      </div>

      {/* KPIs ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi: any, idx: number) => (
          <Card key={idx} noPadding className="p-4 flex flex-col justify-center">
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{kpi.label}</span>
              {kpi.accent && <Badge className="h-5 bg-green-100 text-green-800">↑</Badge>}
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-4xl font-bold ${kpi.accent ? 'text-primary' : 'text-gray-900 dark:text-gray-100'}`}>
                {kpi.value}
              </span>
              {kpi.sub && <span className="text-sm text-gray-500">{kpi.sub}</span>}
            </div>
          </Card>
        ))}
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1 - Casos por estado */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">Casos por estado</h3>
          {renderContent(loadEstado, errEstado, () => (
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataEstado}
                    dataKey="cantidad"
                    nameKey="estado"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                  >
                    {dataEstado?.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_ESTADO[index % COLORS_ESTADO.length]} stroke="rgba(0,0,0,0)" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>

        {/* Gráfico 2 - Casos por mes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">Casos por mes</h3>
          {renderContent(loadMes, errMes, () => (
            <div className="h-[240px] w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataMes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="mes" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="casos" stroke="#C97A8A" strokeWidth={2} dot={{ r: 4, fill: '#C97A8A' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>

        {/* Gráfico 3 - Casos por tipo */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 lg:col-span-2">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">Casos por tipo</h3>
          {renderContent(loadTipo, errTipo, () => (
            <div className="h-[240px] w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataTipo} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="tipo" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="cantidad" fill="#C97A8A" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left Column (Lists) */}
        <div className="flex flex-col gap-6 xl:col-span-3">
          
          {/* Table */}
          <Card title="Últimos Casos Actualizados" noPadding>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800">ID</th>
                    <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800">Beneficiario</th>
                    <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800">Estado</th>
                    <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800">Prioridad</th>
                    <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800">Profesional</th>
                    <th className="px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-800">Última Actividad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {ultimosCasos.map((c: any) => (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                      <td className="px-4 py-3 font-medium">
                        <Link to={`/casos/${c.id}`} className="text-primary hover:underline">{c.idLabel}</Link>
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{c.cliente}</td>
                      <td className="px-4 py-3">
                        <Badge estado={c.estado as any}>
                          {c.estado === 'abierto' ? 'Abierto' : c.estado === 'en_proceso' ? 'En procs.' : c.estado === 'derivado' ? 'Asignado' : 'Cerrado'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge prioridad={c.prioridad as any}>
                          {c.prioridad.charAt(0).toUpperCase() + c.prioridad.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                           <Avatar name={c.ts} size="sm" />
                           <span className="text-gray-600 dark:text-gray-400">{c.ts}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{c.ultima}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

        </div>

        {/* Right Column (Activity Feed) */}
        <div className="xl:col-span-1">
          <Card title="Actividad Reciente" className="h-[calc(100%-1.5rem)]">
            <div className="flex flex-col gap-6 mt-4">
              {actividad.map((feed: any, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    {i !== actividad.length - 1 && <div className="w-px h-full bg-gray-200 dark:bg-gray-700 my-1" />}
                  </div>
                  <div className="flex flex-col pb-2 w-full">
                    <p className="text-sm m-0 text-gray-800 dark:text-gray-200 leading-tight">
                      <span className="font-semibold">{feed.usuario}</span> {feed.accion} <Link to={`/casos/${feed.caso.replace('#','')}`} className="text-primary hover:underline">{feed.caso}</Link>
                    </p>
                    <span className="text-xs text-gray-500 mt-1">{feed.tiempo}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};
