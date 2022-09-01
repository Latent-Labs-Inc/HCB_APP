<template>
	<nav class="w-48 min-h-screen flex flex-col bg-darkBg dark:bg-black">
		<ul class="">
			<li class="sidebar-li"><NuxtLink to="/">Home</NuxtLink></li>
			<li class="sidebar-li"><NuxtLink to="/patients">Patients</NuxtLink></li>
			<li class="sidebar-li"><NuxtLink to="/orders">Orders</NuxtLink></li>
			<li class="sidebar-li">
				<NuxtLink to="/verifications">Verifications</NuxtLink>
			</li>
			<li class="sidebar-li"><NuxtLink to="/payments">Payments</NuxtLink></li>
			<li class="sidebar-li"><NuxtLink to="/customers">Customers</NuxtLink></li>
			<li class="sidebar-li"><NuxtLink to="/profile">Profile</NuxtLink></li>
			<li class="sidebar-li"><NuxtLink to="/help">Help</NuxtLink></li>
		</ul>
	</nav>
</template>

<script></script>

<style scoped>
* {
	margin: 0;
	padding: 0;
}
.sidebar-li {
	font-size: 1.3rem;
	@apply flex align-middle my-3 py-1 justify-center text-center trans rounded-3xl;
}
.sidebar-li:hover {
	cursor: pointer;
	@apply bg-secondary dark:bg-darkPrimary py-2 rounded-full;
}
a {
	text-decoration: none;
	color: white;
	display: inline-block;
	width: 100%;
}
a.active,
a.router-link-exact-active {
	color: white;
}
</style>
