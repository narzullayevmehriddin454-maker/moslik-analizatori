import { useState } from 'react';
import { useAdminLogin, useAdminLogout, useAdminMe, useGetSessionStats, useListSessions } from '@workspace/api-client-react';
import { translations } from '@/lib/translations';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function Admin() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const { data: me, refetch: refetchMe, isLoading: meLoading } = useAdminMe();
  const login = useAdminLogin();
  const logout = useAdminLogout();

  const [password, setPassword] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: stats } = useGetSessionStats({
    query: { enabled: !!me?.authenticated }
  });

  const { data: listData } = useListSessions(
    { page, limit },
    { query: { enabled: !!me?.authenticated } }
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync({ data: { password } });
      refetchMe();
    } catch (err) {
      alert('Login failed');
    }
  };

  const handleLogout = async () => {
    await logout.mutateAsync();
    refetchMe();
  };

  if (meLoading) return null;

  if (!me?.authenticated) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-md bg-card/50 backdrop-blur border-white/10">
          <CardHeader>
            <CardTitle className="text-center font-serif">{t.adminLogin}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder={t.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50"
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/80 text-white" disabled={login.isPending}>
                {login.isPending ? '...' : t.login}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] p-4 md:p-8 relative z-10 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-3xl">{t.dashboard}</h1>
        <Button variant="outline" onClick={handleLogout} disabled={logout.isPending}>{t.logout}</Button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/40 border-white/10">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">{t.totalSessions}</p>
              <p className="text-3xl font-serif text-primary mt-2">{stats.totalSessions}</p>
            </CardContent>
          </Card>
          <Card className="bg-card/40 border-white/10">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">{t.avgScore}</p>
              <p className="text-3xl font-serif text-secondary mt-2">{Math.round(stats.avgScore)}%</p>
            </CardContent>
          </Card>
          <Card className="bg-card/40 border-white/10">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">{t.todaySessions}</p>
              <p className="text-3xl font-serif mt-2">{stats.todaySessions}</p>
            </CardContent>
          </Card>
          <Card className="bg-card/40 border-white/10">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">{t.topLang}</p>
              <p className="text-3xl font-serif mt-2">{stats.topLanguage}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="bg-card/40 border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead>{t.person1}</TableHead>
                <TableHead>{t.person2}</TableHead>
                <TableHead>{t.compatibility}</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listData?.sessions?.map((s) => (
                <TableRow key={s.id} className="border-white/10 hover:bg-white/5">
                  <TableCell>
                    <div className="font-medium">{s.name1}</div>
                    <div className="text-xs text-muted-foreground">{t.zodiacEmojis[s.zodiac1]} {t.zodiacNames[s.zodiac1]}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{s.name2}</div>
                    <div className="text-xs text-muted-foreground">{t.zodiacEmojis[s.zodiac2]} {t.zodiacNames[s.zodiac2]}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      s.score >= 70 ? 'border-[#00f3ff] text-[#00f3ff]' : 
                      s.score >= 40 ? 'border-[#bc13fe] text-[#bc13fe]' : 
                      'border-[#ff4444] text-[#ff4444]'
                    }>
                      {s.score}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {!listData?.sessions?.length && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    {t.noData}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {listData && listData.total > limit && (
            <div className="p-4 border-t border-white/10 flex justify-between items-center">
              <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>{t.prevPage}</Button>
              <span className="text-sm text-muted-foreground">Page {page} of {Math.ceil(listData.total / limit)}</span>
              <Button variant="outline" disabled={page * limit >= listData.total} onClick={() => setPage(p => p + 1)}>{t.nextPage}</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}