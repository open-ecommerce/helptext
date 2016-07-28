<?php
/* @var $this yii\web\View */

use app\assets\AppAsset;
use app\widgets\Alert;
use yii\helpers\Html;

$bundle = AppAsset::register($this);
$imgPath = $bundle->baseUrl;

$this->title = 'TextHelp+ for NNLS Drop-in';
?>

<div class="site-index container">
  <div class="row">
  </br>
  </br>
  </br>
    <h3>Our Messaging Platform</h3>
    <p>HELPtext+ messaging platform - in development - allows the integration of text and multimedia messages, coming from various sources (e.g. text, Facebook Messenger) onto a single interface.</p>

    <p>Our mission is to link-up helpers and people in crisis. HELPtext+  will equip helplines with a tool to open emerging communication channels easily and will provide them with the data to manage their resources more effectively, turning new and existing helplines into digital communicators.</p>

    <p>The asynchronous nature of messages - as opposed to calls - allows a new service delivery model where accurate prioritising and management of cases increase helpers' ability to scale up their impact. </p>

    <p>Our system reduces the cost of the service, by allowing helpers to respond to calls wherever they are, on web or app, with an automated rule or a supervisor allocating cases. This avoids the costs associated with call centres and enables transnational support without the additional expense of long distance calls.</p>

    <p>Impact is measured via automated reports, giving frequency, time and day of cases, all segmented by types, which are tailored to the specific service provided by each helpline. This valuable data aims at generating a deep insight into the behaviour and needs of users, enabling helplines to recruit and manage helpers more adequately and, thus, maximise their impact.</p>

  </div>
  <div class="row">
        <div class="col-lg-10 col-lg-offset-2">
        <?= Html::img($imgPath.'/img/helper_on_phone_3.jpg', ['alt' => 'Helptext Helpline Solutions'])?>
  </div>
  <div class="row">
    <h3>Is Your Helpline Ready?</h3>
    <p>Your users are changing: 32% of people would rather text you than talk to you, and 51% of teens would rather communicate digitally than in person, even with friends.</p>

    <p>Messaging allows you to reach to people that are too vulnerable to talk, for fear of being heard, such as homeless women or domestic violence victims. Adults on the autistic spectrum prefer text to talk and people with English as a 2nd language find it easier to understand a text than a person on the phone.</p>

    <p>HLPText+ is a platform designed exclusively to empower non-profit helplines like yours. You will be able to easily set up free text line and provide safe, secure, and confidential support via SMS. We provide you with a simple web interface so that you can manage these texts like emails, on your phone or a computer.</p>

    <p>Whether you have many case-workers or just a couple, full time or at specific times of the day, the platform will help you manage your users' expectations.</p>

    <p>And you have our commitment that we will upgrade the system continuously, to enable your helpline to keep up with your users. So that you can keep doing what you do best: HELP.</p>

  </div>
</div>
