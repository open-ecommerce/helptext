<?php
use app\assets\AppAsset;
use app\widgets\Alert;
use yii\helpers\Html;


$bundle = AppAsset::register($this);
$imgPath = $bundle->baseUrl;

/* @var $this yii\web\View */
$this->title                   = 'About Us';
$this->params['breadcrumbs'][] = $this->title;
?>

<div class="site-about">
  <div class="col-md-12">
    <h2>We are open ecommerce</h2>
    <p>We are a group of independent developers, marketing researchers & designers specialized in Open Source platforms as Magento, Yii and Wordpress working from our studio in London.</p>

    <p>Open e-commerce was set up as a social enterprise. Our projects are united by a common underlying idea. Everything we do aims to empower people and go along them in the path to realize their projects.</p>

    <p>Part of the income from our Agency work goes to create links with the community and develop community projects. So far we have engaged with projects in South America, and more recently European and UK-based projects. This is our philosophy.</p>
  </div>
    <div class="col-md-6">
      <h3> How can we help you?</h3>
      <p>If you are thinking of adding text to your helpline, please contact us.</p>
      <p> We will help you with our expertise and build a system to cater for your needs.</p>
      <p>Send us an email to <a href="mailto:info@helptext.uk?Subject=Landing Page" target="_top">info@helptext.uk</a> or text us to 07879387106, and we will get back to you within 24 hours.</p>
    </br>
    </div>
    <div class="col-md-6">
      <?= Html::img($imgPath.'/img/helptext-offices_4.jpg', ['alt' => 'Open-ecommerce.org Office'])?>
    </div>
</div>
