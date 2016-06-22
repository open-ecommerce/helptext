<?php
/**
 *  @link    http://foundationize.com
 *  @package foundationize/yii2-foundation
 *  @version dev
 */

namespace foundationize\foundation;

/**
 * FnAlert: Foundation 6 version of Alert widget.
 * Uses callout boxes: http://foundation.zurb.com/sites/docs/callout.html
 * 
 * Alert widget renders a message from session flash. All flash messages are displayed
 * in the sequence they were assigned using setFlash. You can set message as following:
 *
 * ```php
 * \Yii::$app->session->setFlash('error', 'This is the message');
 * \Yii::$app->session->setFlash('success', 'This is the message');
 * \Yii::$app->session->setFlash('info', 'This is the message');
 * ```
 *
 * Multiple messages could be set as follows:
 *
 * ```php
 * \Yii::$app->session->setFlash('error', ['Error 1', 'Error 2']);
 * ```
 *
 * @author gvanto
 */
class FnAlert extends Widget
{
    /**
     * @var array the alert types configuration for the flash messages.
     * This array is setup as $key => $value, where:
     * - $key is the name of the session flash variable
     * - $value is the bootstrap alert type (i.e. danger, success, info, warning)
     */
    public $alertTypes = [
        'error'   => 'callout alert',
        'danger'  => 'callout warning',
        'success' => 'callout success',
        'info'    => 'callout primary',
        'warning' => 'callout warning'
    ];
    /**
     * @var array the options for rendering the close button tag.
     */
    public $closeButton = [];


    public function init()
    {
        parent::init();

        $session = \Yii::$app->session;
        $flashes = $session->getAllFlashes();
        $appendCss = isset($this->options['class']) ? ' ' . $this->options['class'] : '';

        foreach ($flashes as $type => $data) {
            if (isset($this->alertTypes[$type])) {
                $data = (array) $data;
                foreach ($data as $i => $message) {
                    /* initialize css class for each alert box */
                    $this->options['class'] = $this->alertTypes[$type] . $appendCss;

                    /* assign unique id to each alert box */
                    $this->options['id'] = $this->getId() . '-' . $type . '-' . $i;
                    
                    $this->renderHtml($message, $this->options['class']);
                    
//                    echo \yii\bootstrap\Alert::widget([
//                        'body' => $message,
//                        'closeButton' => $this->closeButton,
//                        'options' => $this->options,
//                    ]);
                }

                $session->removeFlash($type);
            }
        }
    }
    
    public function renderHtml($message, $cssClass)
    {
        ?>
        <div class="<?= $cssClass ?>" data-closable>
            <p>
                <?= $message ?>
            </p>
            
            <button class="close-button" aria-label="Dismiss alert" type="button" data-close>
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <?php
    }
}
