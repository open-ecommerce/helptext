<?php
/* @var $this yii\web\View */

use yii\helpers\Html;

$this->title = 'TextHelp+ for NNLS Drop-in';
?>
<div class="site-index ">
    <div class="header vert">
        <h2 class="lead">Welcome to the HelpText+ System!</h2>
    </div>
    <div class="featurette">
        <div class="container">
            <div class="row">
                <div class="col-md-12 text-center">
                    <div class="site-index">
                        <?= \dmstr\modules\prototype\widgets\HtmlWidget::widget(['enableFlash' => true]) ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="large-12 columns text-center">
        <h2>Yii2, Foundationized!</h2>
        
        <div class="callout secondary">            
            <p>Welcome to this demo of the <a target="_blank" href="http://www.yiiframework.com/doc-2.0/guide-index.html">Yii2 PHP framework</a>, pre-configured with <a href="http://foundation.zurb.com/" target="_blank">Foundation 6</a>.</p>
            
            <p>To get started with your own foundationized Yii2 project, please see the <a href="http://foundationize.com/#yii2">Yii2 + Foundation installation instructions</a>.</p>

            <p>No need to install and configure extensions, this version of Yii2 is pre-configured and ready to roll with Foundation 6.</p>
        </div>
        
        <div class="callout large">

            <p>Once you've exhausted the fun in this document, you should check out:</p>

            <div class="row">
                <div class="large-4 medium-4 columns">
                    <p><a href="http://foundation.zurb.com/sites/docs/">Foundation Documentation</a><br />Everything you need to know about using the framework.</p>
                </div>

                <div class="large-4 medium-4 columns">
                    <p><a href="http://zurb.com/university/code-skills">Foundation Code Skills</a><br />These online courses offer you a chance to better understand how Foundation works and how you can master it to create awesome projects.</p>
                </div>

                <div class="large-4 medium-4 columns">
                    <p><a href="http://foundation.zurb.com/forum">Foundation Forum</a><br />Join the Foundation community to ask a question or show off your knowlege.</p>
                </div>              
            </div>

            <div class="row">
                <div class="large-4 medium-4 medium-push-2 columns">
                    <p><a href="http://github.com/zurb/foundation">Foundation on Github</a><br />Latest code, issue reports, feature requests and more.</p>
                </div>

                <div class="large-4 medium-4 medium-pull-2 columns">
                    <p><a href="https://twitter.com/ZURBfoundation">@zurbfoundation</a><br />Ping us on Twitter if you have questions. When you build something with this we'd love to see it (and send you a totally boss sticker).</p>
                </div>              
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="large-8 medium-8 columns">
        <h5>Here&rsquo;s your basic grid:</h5>
        <!-- Grid Example -->

        <div class="row">
            <div class="large-12 columns">
                <div class="callout ">
                    <p><strong>This is a twelve column section in a row.</strong> Each of these includes a div.callout element so you can see where the columns are - it's not required at all for the grid.</p>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="large-6 medium-6 columns">
                <div class="callout">
                    <p>Six columns</p>
                </div>
            </div>
            <div class="large-6 medium-6 columns">
                <div class="callout">
                    <p>Six columns</p>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="large-4 medium-4 small-4 columns">
                <div class="callout">
                    <p>Four columns</p>
                </div>
            </div>
            <div class="large-4 medium-4 small-4 columns">
                <div class="callout">
                    <p>Four columns</p>
                </div>
            </div>
            <div class="large-4 medium-4 small-4 columns">
                <div class="callout">
                    <p>Four columns</p>
                </div>
            </div>
        </div>

        <hr />

        <h5>We bet you&rsquo;ll need a form somewhere:</h5>
        <form>
            <div class="row">
                <div class="large-12 columns">
                    <label>Input Label</label>
                    <input type="text" placeholder="large-12.columns" />
                </div>
            </div>
            <div class="row">
                <div class="large-4 medium-4 columns">
                    <label>Input Label</label>
                    <input type="text" placeholder="large-4.columns" />
                </div>
                <div class="large-4 medium-4 columns">
                    <label>Input Label</label>
                    <input type="text" placeholder="large-4.columns" />
                </div>
                <div class="large-4 medium-4 columns">
                    <label>Input Label</label>
                    <div class="input-group">
                        <input type="text" placeholder="small-9.columns" class="input-group-field" />
                        <span class="input-group-label">.com</span>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="large-12 columns">
                    <label>Select Box</label>
                    <select>
                        <option value="husker">Husker</option>
                        <option value="starbuck">Starbuck</option>
                        <option value="hotdog">Hot Dog</option>
                        <option value="apollo">Apollo</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="large-6 medium-6 columns">
                    <label>Choose Your Favorite</label>
                    <input type="radio" name="pokemon" value="Red" id="pokemonRed"><label for="pokemonRed">Radio 1</label>
                    <input type="radio" name="pokemon" value="Blue" id="pokemonBlue"><label for="pokemonBlue">Radio 2</label>
                </div>
                <div class="large-6 medium-6 columns">
                    <label>Check these out</label>
                    <input id="checkbox1" type="checkbox"><label for="checkbox1">Checkbox 1</label>
                    <input id="checkbox2" type="checkbox"><label for="checkbox2">Checkbox 2</label>
                </div>
            </div>
            <div class="row">
                <div class="large-12 columns">
                    <label>Textarea Label</label>
                    <textarea placeholder="small-12.columns"></textarea>
                </div>
            </div>
        </form>
    </div>

    <div class="large-4 medium-4 columns">
        <h5>Try one of these buttons:</h5>
        <p><a href="#" class="small button">Simple Button</a><br/>
            <a href="#" class="medium success button">Success Button</a><br/>
            <a href="#" class="medium alert button">Alert Button</a><br/>
            <a href="#" class="medium secondary button">Secondary Button</a></p>
        <div class="callout">
            <h5>So many components, girl!</h5>
            <p>A whole kitchen sink of goodies comes with Foundation. Check out the docs to see them all, along with details on making them your own.</p>
            <a href="http://foundation.zurb.com/docs/" class="small button">Go to Foundation Docs</a>
        </div>
    </div>
</div>

