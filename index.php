<?php require_once 'functions.php'; ?>
<!DOCTYPE html>
<html>
<head lang="en">
	<meta charset="UTF-8">
	<title>ContentLibrary</title>

	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.css">
	<link rel="stylesheet" href="assets/css/style.css"/>
</head>
<body class="no-js blue-theme">

<div id="wrapper"></div>


<?php get_templates(['layouts', 'index-cart', 'login-form']); ?>

<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore.js"></script>
<!--<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/4.13.1/lodash.min.js"></script>-->
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone.js"></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/masonry/4.1.0/masonry.pkgd.min.js"></script>

<script src="/assets/js/app.js"></script>

</body>
</html>