import { ToolsCard } from '../../interfaces/tools-card.interface';

export const TOOLS_CARDS: ToolsCard[] = [
  {
    id: 'donations',
    icon: 'assets/img/tools/donation-icon.svg',
    textPrimary: 'tools.tools_page.donations.textPrimary',
    textSecondary: 'tools.tools_page.donations.textSecondary',
    trackClickEventNamePrimaryAction: 'ux_go_to_donations',
  },
  {
    icon: 'assets/img/tools/planner-icon.svg',
    textPrimary: 'tools.tools_page.planner.textPrimary',
    textSecondary: 'tools.tools_page.planner.textSecondary',
    trackClickEventNamePrimaryAction: 'ux_go_to_planner',
  },
  {
    icon: 'assets/img/tools/investor-test-icon.svg',
    textPrimary: 'tools.tools_page.investor_test.textPrimary',
    textSecondary: 'tools.tools_page.investor_test.textSecondary',
    urlPrimaryAction: '/wealth-management/investor-test-options',
    trackClickEventNamePrimaryAction: 'ux_go_to_investor_profile',
  },
];
