// third-party
import { FormattedMessage } from 'react-intl';

// project-imports
import { handlerUserDialog } from 'api/user';
import { NavActionType } from 'config';

// assets
import {
  Add,
  Link1,
  KyberNetwork,
  Messages2,
  Calendar1,
  Kanban,
  Profile2User,
  Bill,
  UserSquare,
  ShoppingBag,
  Wallet1
} from 'iconsax-react';

// type

// icons
const icons = {
  applications: KyberNetwork,
  chat: Messages2,
  calendar: Calendar1,
  kanban: Kanban,
  User: Profile2User,
  invoice: Bill,
  profile: UserSquare,
  ecommerce: ShoppingBag,
  add: Add,
  link: Link1,
  wallet: Wallet1
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const applications = {
  id: 'group-applications',
  title: <FormattedMessage id="applications" />,
  icon: icons.applications,
  type: 'group',
  children: [
    // {
    //   id: 'chat',
    //   title: <FormattedMessage id="chat" />,
    //   type: 'item',
    //   url: '/apps/chat',
    //   icon: icons.chat,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'calendar',
    //   title: <FormattedMessage id="calendar" />,
    //   type: 'item',
    //   url: '/apps/calendar',
    //   icon: icons.calendar,
    //   actions: [
    //     {
    //       type: NavActionType.LINK,
    //       label: 'Full Calendar',
    //       icon: icons.link,
    //       url: 'https://fullcalendar.io/docs/react',
    //       target: true
    //     }
    //   ]
    // },
    // {
    //   id: 'kanban',
    //   title: <FormattedMessage id="kanban" />,
    //   type: 'item',
    //   icon: icons.kanban,
    //   url: '/apps/kanban/board',
    //   link: '/apps/kanban/:tab',
    //   breadcrumbs: false
    // },
    {
      id: 'User',
      title: <FormattedMessage id="User Management" />,
      type: 'item',
      icon: icons.User,
      url: '/apps/User/User-list',
      actions: [
        {
          type: NavActionType.FUNCTION,
          label: 'Add User',
          function: () => handlerUserDialog(true),
          icon: icons.add
        }
      ]
    },
    {
      id: 'events',
      title: <FormattedMessage id="Events Management" />,
      type: 'item',
      icon: icons.User,
      url: '/apps/event-list'
    },
    {
      id: 'acl',
      title: <FormattedMessage id="ACL Management" />,
      type: 'collapse',
      icon: icons.User,
      url: '/apps/ACL/admin-list',
      children: [
        {
          id: 'admin-list',
          title: <FormattedMessage id="Admins" />,
          type: 'item',
          url: '/apps/ACL/admin-list',
          breadcrumbs: false
        },
        {
          id: 'acl-roles',
          title: <FormattedMessage id="Roles" />,
          type: 'item',
          url: '/apps/ACL/ACL-roles',
          breadcrumbs: false
        },
        {
          id: 'acl-permissions',
          title: <FormattedMessage id="Permissions" />,
          type: 'item',
          url: '/apps/ACL/ACL-permissions',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'transactions',
      title: <FormattedMessage id="Wallet Transactions" />,
      type: 'collapse',
      icon: icons.wallet,
      url: '/apps/transactions/wallet-transactions-list',
      children: [
        {
          id: 'transactions-list',
          title: <FormattedMessage id="Transactions List" />,
          type: 'item',
          url: '/apps/transactions/wallet-transactions-list',
          breadcrumbs: false
        }
      ]
    }
    // {
    //   id: 'invoice',
    //   title: <FormattedMessage id="invoice" />,
    //   url: '/apps/invoice/dashboard',
    //   type: 'collapse',
    //   icon: icons.invoice,
    //   breadcrumbs: false,
    //   children: [
    //     {
    //       id: 'create',
    //       title: <FormattedMessage id="create" />,
    //       type: 'item',
    //       url: '/apps/invoice/create',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'details',
    //       title: <FormattedMessage id="details" />,
    //       type: 'item',
    //       url: '/apps/invoice/details/1',
    //       link: '/apps/invoice/details/:id',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'list',
    //       title: <FormattedMessage id="list" />,
    //       type: 'item',
    //       url: '/apps/invoice/list',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'edit',
    //       title: <FormattedMessage id="edit" />,
    //       type: 'item',
    //       url: '/apps/invoice/edit/1',
    //       link: '/apps/invoice/edit/:id',
    //       breadcrumbs: false
    //     }
    //   ]
    // },
    // {
    //   id: 'Profile',
    //   title: <FormattedMessage id="profile" />,
    //   type: 'item',
    //   icon: icons.profile,
    //   url: '/apps/profiles/account/basic',
    //   link: '/apps/profiles/account/:tab',
    //   breadcrumbs: false
    // }
  ]
};

export default applications;
