<?php
    header("content-type: text/xml");
    echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
?>
<Response>
    <Dial><?= $response; ?>></Dial>
    <Say>something it is going very wrong.</Say>
</Response>
