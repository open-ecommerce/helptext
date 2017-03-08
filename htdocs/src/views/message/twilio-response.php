<?php
    header("content-type: text/xml");
    echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
?>
<Response>
    <Dial><?= $numberToCall; ?>></Dial>
    <Say>Please try to call again.</Say>
</Response>
