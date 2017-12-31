<?php
include 'config.php';

// Generate an ID for posting authentication
if (!isset($_COOKIE['auth'])) {
	setcookie('auth', uniqid(), CONFIG_COOKIE_TIMEOUT + time(), '/');
}
if (!isset($_COOKIE['theme']))
	setcookie('theme', CONFIG_DEFAULT_THEME,
	CONFIG_COOKIE_TIMEOUT + time(), '/');

// Core functions
function ralog($m)
{
	$ip = $_SERVER['HTTP_X_REAL_IP'];
	$time = date('c');
	file_put_contents(
		CONFIG_RAL_LOG,
		"$time - ($ip) $m\n",
		FILE_APPEND|LOCK_EX
	);
}
function head($ROOT)
{
	print "<meta name=viewport content='width=device-width,"
	. " maximum-scale=1, minimum-scale=1'>"
	. "<link rel=stylesheet href='$ROOT"."css/base.css'>";
	$theme = get_theme();

	$path = dirname(__FILE__);
	if (file_exists("$path/../js/themes/$theme.js"))
		print "<script src='$ROOT"."js/themes/$theme.js'></script>";
	if (file_exists("$path/../css/$theme.css"))
		print "<link rel=stylesheet href='$ROOT"."css/$theme.css'>";
}
function get_theme()
{
	if (!isset($_COOKIE['theme']))
		return CONFIG_DEFAULT_THEME;
	return $_COOKIE['theme'];
}