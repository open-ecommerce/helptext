<?php
// OE using the https://github.com/dmstr/yii2-pages-module to build the menu from the admin

namespace app\views\layouts;

use yii\bootstrap\Nav;
use yii\bootstrap\NavBar;

$menuItems = [];

if (\Yii::$app->hasModule('user')) {
    if (\Yii::$app->user->isGuest) {
        #$menuItems[] = ['label' => 'Signup', 'url' => ['/user/registration/register']];
        $menuItems[] = ['label' => 'Login', 'url' => ['/user/security/login']];
    } else {
        $menuItems[] = [
            'label' => '<i class="glyphicon glyphicon-user"></i> ' . \Yii::$app->user->identity->username,
            'options' => ['id' => 'link-user-menu'],
            'items' => [
//                [
//                    'label' => '<i class="glyphicon glyphicon-user"></i>View Profile',
//                    'url' => ['/user/profile/show', 'id' => \Yii::$app->user->id],
//                ],
                [
                    'label' => '<i class="glyphicon glyphicon-user"></i> Profile',
                    'url' => ['/user/settings/profile/', 'id' => \Yii::$app->user->id],
                ],
                '<li class="divider"></li>',
                [
                    'label' => '<i class="glyphicon glyphicon-log-out"></i> Logout',
                    'url' => ['/user/security/logout'],
                    'linkOptions' => ['data-method' => 'post', 'id' => 'link-logout'],
                ],
            ],
        ];
        $menuItems[] = [
            'label' => '<i class="glyphicon glyphicon-cog"></i>',
            'url' => ['/backend'],
            'visible' => \Yii::$app->user->can('backend_default_index', ['route' => true]),
        ];
    }
}

NavBar::begin(
        [
            'brandLabel' => getenv('APP_TITLE'),
            'brandUrl' => \Yii::$app->homeUrl,
            'options' => [
                'class' => 'navbar navbar-inverse navbar-fixed-top',
            ],
        ]
);

$menuBeforeItems = [
    ['label' => 'Clients', 'url' => ['/contact']],
    ['label' => 'Cases', 'url' => ['/cases']],
    ['label' => 'Reports',
        'items' => [
            ['label' => 'Cases', 'url' => ['#']],
            ['label' => 'Cases by Helpers', 'url' => ['#']],
        ],
        'visible' => \Yii::$app->user->can('view_mnu_reports', ['route' => true]),
    ],
    ['label' => 'Utilities', 'items' => [
            ['label' => 'Case Categories', 'url' => ['/case-category']],
            ['label' => 'Case Severities', 'url' => ['/severity']],
            ['label' => 'Outcome categories', 'url' => ['/outcome-category']],
            '<li class="divider"></li>',
            ['label' => 'Messages', 'url' => ['/message']],
            '<li class="divider"></li>',
            ['label' => 'Configuration', 'url' => ['/configuration']],
            '<li class="divider"></li>',
            ['label' => 'SMS Phone Tester', 'url' => ['message/testsms']],
        ],
        'visible' => \Yii::$app->user->can('view_mnu_utilities', ['route' => true]),
        ],
];

echo Nav::widget(
        [
            'options' => ['class' => 'navbar-nav'],
            'encodeLabels' => false,
            'items' => $menuBeforeItems,
        ]
);
echo Nav::widget(
        [
            'options' => ['class' => 'navbar-nav'],
            'encodeLabels' => false,
            'items' => \dmstr\modules\pages\models\Tree::getMenuItems('root'),
        ]
);
?>
<!--    <ul class="nav navbar-nav pull-right">
        <li class="dropdown" id="menuLogin">
            <a class="dropdown-toggle" href="#" data-toggle="dropdown" id="navLogin">Login</a>
            <div class="dropdown-menu" style="padding:17px;">
                <form class="form" id="formLogin">
                    <input name="username" id="username" type="text" placeholder="Username">
                    <input name="password" id="password" type="password" placeholder="Password"><br>
                    <button type="button" id="btnLogin" class="btn">Login</button>
                </form>
            </div>
        </li>
    </ul>-->
<?php
echo Nav::widget(
        [
            'options' => ['class' => 'navbar-nav navbar-right'],
            'encodeLabels' => false,
            'items' => $menuItems,
        ]
);




NavBar::end();
