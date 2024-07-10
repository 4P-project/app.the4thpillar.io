import type { RouteLocationRaw } from 'vue-router';

export interface CollapseResolvedConfig {
  name: string;
  divider?: boolean;
  icon: {
    name: string;
    class?: string;
  };
  isPro?: boolean;
  children?: any[];
  component?: {
    name: string;
    props?: any;
  };
  to?: RouteLocationRaw;
  click?: () => void | Promise<void>;
  activePath?: string;
  /**
   * @default 'start'
   */
  position?: 'start' | 'end';
}

export function useCollapse() {
  const app = useAppConfig();

  const menuItems = computed(() => {
    if (app.layout.collapse?.navigation?.enabled === false || app.layout.collapse?.navigation?.items?.length === 0) {
      return [];
    }
    return app.layout.collapse?.navigation?.items?.map(
      (navigation) =>
        <CollapseResolvedConfig>{
          ...navigation,
          position: navigation.position ?? 'start',
        },
    );
  });

  const isOpen = useState('collapse-open', () => true);
  const isMobileOpen = useState('collapse-mobile-open', () => false);

  const header = computed(() => {
    return app.layout.collapse?.navigation?.header;
  });

  const footer = computed(() => {
    return app.layout.collapse?.navigation?.footer;
  });

  function toggle() {
    // If no sidebar item is selected, open the first one
    const { lg } = useTailwindBreakpoints();
    if (lg.value) {
      isOpen.value = !isOpen.value;
    } else {
      isMobileOpen.value = !isMobileOpen.value;
    }
  }

  if (process.client) {
    const route = useRoute();
    const { lg } = useTailwindBreakpoints();
    watch(lg, (isLg) => {
      if (isLg) {
        isMobileOpen.value = false;
      }
    });
    watch(
      () => route.fullPath,
      () => {
        if (!lg.value) {
          isMobileOpen.value = false;
        }
      },
    );
  }

  return {
    toggle,
    menuItems,
    isOpen,
    isMobileOpen,
    header,
    footer,
  };
}
