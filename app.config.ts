export default defineAppConfig({
  meta: {
    title: '4P Project',
    titleSuffix: 'Community-build dMail & dChat project powered by Four Token',
    description: 'Self-custodial, permissionless and decentralized email and messaging.',
    twitter: {
      site: '@4pfour',
    },
  },
  links: {
    privacyPolicy: 'https://the4thpillar.io/privacy-policy/',
    termsOfUse: 'https://github.com/4P-project/static-assets/raw/main/pdf/end-user-agreement.pdf',
  },
  layout: {
    collapse: {
      toolbar: {
        enabled: true,
        showTitle: true,
        showNavBurger: true,
        tools: [
          {
            component: 'ThemeToggle',
          },
          {
            component: 'ToolbarNetwork',
          },
          {
            component: 'ToolbarAccountMenu',
          },
        ],
      },
      navigation: {
        enabled: true,
        header: {
          component: 'CollapseNavigationHeader',
        },
        footer: {
          component: 'CollapseNavigationFooter',
        },
        items: [
          {
            name: 'Dashboard',
            icon: { name: 'ph:sidebar-duotone', class: 'w-5 h-5' },
            to: '/dashboard',
          },
          {
            name: 'Mail',
            icon: { name: 'ph:envelope-simple-duotone', class: 'w-5 h-5' },
            activePath: '/mail',
            children: [
              {
                name: 'Compose new',
                to: '/mail/compose',
                icon: { name: 'ph:plus', class: 'w-4 h-4' },
              },
              {
                name: 'Inbox',
                to: '/mail/inbox',
                icon: { name: 'ph:tray-duotone', class: 'w-4 h-4' },
              },
              {
                name: 'Sent',
                to: '/mail/sent',
                icon: { name: 'ph:paper-plane-tilt-duotone', class: 'w-4 h-4' },
              },
            ],
          },
          {
            name: 'Chat',
            icon: { name: 'ph:chat-circle-duotone', class: 'w-5 h-5' },
            to: '/chat',
          },
          {
            name: 'Settings',
            icon: { name: 'ph:gear-six-duotone', class: 'w-5 h-5' },
            to: '/settings',
          },
        ],
      },
    },
    panels: [
      {
        name: 'network',
        position: 'right',
        component: 'PanelNetwork',
      },
    ],
  },
  /**
   * Shuriken UI layer configuration
   */
  nui: {
    /**
     * Default shape for components
     *
     * This allows to not have to specify the shape prop on every component.
     * Define only the ones you want to override.
     */
    defaultShapes: {
      /**
       * Default shape for the BaseAccordion component
       *
       * @type {'straight' | 'rounded' | 'curved'}
       */
      accordion: 'rounded',
      /**
       * Default shape for the BaseAutocompleteItem component
       *
       * @type {'straight' | 'rounded' | 'curved' | 'full'}
       */
      autocompleteItem: 'rounded',
      /**
       * Default shape for the BaseAvatar component
       *
       * @type {'straight' | 'rounded' | 'curved' | 'full'}
       */
      avatar: 'full',
      /**
       * Default shape for the BaseButton component
       *
       * @type {'straight' | 'rounded' | 'curved' | 'full'}
       */
      button: 'rounded',
      /**
       * Default shape for the BaseButtonAction component
       *
       * @type {'straight' | 'rounded' | 'curved' | 'full'}
       */
      buttonAction: 'rounded',
      /**
       * Default shape for the BaseButtonIcon component
       *
       * @type {'straight' | 'rounded' | 'curved' | 'full'}
       */
      buttonIcon: 'rounded',
      /**
       * Default shape for the BaseButtonIcon component
       *
       * @type {'straight' | 'rounded' | 'curved' | 'full'}
       */
      buttonClose: 'full',
      /**
       * Default shape for the BaseCard component
       *
       * @type {'straight' | 'rounded' | 'curved' | 'full'}
       */
      card: 'rounded',
      /**
       * Default shape for the BaseDropdown component
       *
       * @type {'straight' | 'rounded' | 'curved' | 'full'}
       */
      dropdown: 'rounded',
      /**
       * Default shape for the BaseIconBox component
       *
       * @type {'straight' | 'rounded' | 'curved' | 'full'}
       */
      iconBox: 'rounded',
      /**
       * Default shape for all input components component
       * - BaseAutocomplete
       * - BaseCheckbox
       * - BaseInput
       * - BaseInputFile
       * - BaseInputListbox
       * - BaseInputSelect
       * - BaseInputTextarea
       *
       * @type {'straight' | 'rounded' | 'curved' | 'full'}
       */
      input: 'rounded',
      /**
       * Default shape for the BaseMessage component
       *
       * @type {'straight' | 'rounded' | 'curved' | 'full'}
       */
      message: 'curved',
      /**
       * Default shape for the BasePagination component
       *
       * @type {'straight' | 'rounded' | 'curved' | 'full'}
       */
      pagination: 'rounded',
      /**
       * Default shape for the BaseProgress component
       *
       * @type {'straight' | 'rounded' | 'curved' | 'full'}
       */
      progress: 'full',
      /**
       * Default shape for the BaseProse component
       *
       * @type {'straight' | 'rounded' | 'curved'}
       */
      prose: 'rounded',
      /**
       * Default shape for the BaseTabSlider component
       *
       * @type {'straight' | 'rounded' | 'curved' | 'full'}
       */
      tabSlider: 'rounded',
      /**
       * Default shape for the BaseTag component
       *
       * @type {'straight' | 'rounded' | 'curved' | 'full'}
       */
      tag: 'rounded',
    },
  },
});
