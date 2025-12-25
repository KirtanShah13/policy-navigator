import { Moon, Sun, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/useTheme';

const themes = [
  { id: 'ocean', name: 'Ocean Blue', color: 'bg-[hsl(217,91%,50%)]' },
  { id: 'emerald', name: 'Emerald', color: 'bg-[hsl(160,84%,39%)]' },
  { id: 'sunset', name: 'Sunset', color: 'bg-[hsl(25,95%,53%)]' },
  { id: 'violet', name: 'Violet', color: 'bg-[hsl(262,83%,58%)]' },
  { id: 'rose', name: 'Rose', color: 'bg-[hsl(346,77%,50%)]' },
] as const;

export function ThemeSwitcher() {
  const { theme, colorTheme, setTheme, setColorTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Mode</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme('light')} className="gap-2">
          <Sun className="h-4 w-4" />
          Light
          {theme === 'light' && <span className="ml-auto text-primary">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className="gap-2">
          <Moon className="h-4 w-4" />
          Dark
          {theme === 'dark' && <span className="ml-auto text-primary">✓</span>}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Color Theme</DropdownMenuLabel>
        
        {themes.map((t) => (
          <DropdownMenuItem key={t.id} onClick={() => setColorTheme(t.id)} className="gap-2">
            <div className={`w-4 h-4 rounded-full ${t.color}`} />
            {t.name}
            {colorTheme === t.id && <span className="ml-auto text-primary">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
