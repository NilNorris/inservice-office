import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';

export const appRoutes: Routes = [
    {
        path: 'admin',
        component: AppLayout,
        children: [
            { path: 'customer', loadChildren: () => import('./app/pages/admin/customer/customer.routes') },
            { path: 'tip', loadChildren: () => import('./app/pages/admin/tip/tip.routes') },
            { path: 'job', loadChildren: () => import('./app/pages/admin/job/job.routes') },
            { path: 'ad', loadChildren: () => import('./app/pages/admin/ad/ad.routes') },
            { path: 'setting', loadChildren: () => import('./app/pages/admin/setting/setting.routes') },
            { path: 'payment', loadChildren: () => import('./app/pages/admin/payment/payment.routes') },
            { path: 'notification', loadChildren: () => import('./app/pages/admin/notification/notification.routes') },
        ]
    },
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' },
];
