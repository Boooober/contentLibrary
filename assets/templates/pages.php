<script type="text/template" id="contactPage">
	<div class="contact-page">


		<div class="container">
			<h1>Contact us</h1>
			<div class="row">
				<div class="col-sm-6 col-sm-push-6">
					<div class="aside-text">
						<p>If you have any questions regarding this privacy statement, the practices of this site or your dealings with us, please do not hesitate to contact us at the below-mentioned address, e-mail address, telephone number or fax number. </p>
					</div>
				</div>
				<div class="col-sm-6 col-sm-pull-6">
					<div class="contact-form"></div>
				</div>
			</div>
		</div>
		<div class="map-wrapper">
			<div class="box contacts-box">
				<div class="box-body">
					<p>You can reach us via the following contact details</p>
					<ul class="contact-info">
						<li>
							<h3>Address</h3>
							<p><i class="icon-location"></i>14B Kudryashova Street 03035 Kyiv, Ukraine</p>
						</li>
						<li>
							<h3>Phone/Fax/Email</h3>
							<p><i class="icon-phone"></i>+380-44-390-5457</p>
							<p><i class="icon-fax"></i>+380-44-390-0861</p>
							<p><i class="icon-email"></i>contacts@epam.com</p>
						</li>
						<li>
							<h3>Opening hours</h3>
							<p>Monday – Friday</p>
							<p>08:00 – 12:00</p>
							<p>13:00 – 17:00</p>
						</li>
					</ul>
				</div>

			</div>
			<div id="map" class="google-map"></div>
		</div>

	</div>
</script>


<script type="text/template" id="contactForm">
	<form class="form">
		<div class="form-group">
			<label for="contactName" class="sr-only">Your name</label>
			<input type="text" name="name" id="contactName" class="form-control" placeholder="Your name" />
		</div>

		<div class="form-group">
			<label for="contactEmail" class="sr-only">Your email</label>
			<input type="email" name="email" id="contactEmail" class="form-control" placeholder="Your email"/>
		</div>

		<div class="form-group">
			<label for="contactMessage" class="sr-only">Your question</label>
			<textarea name="message" id="contactMessage" class="form-control" placeholder="Your question" rows="5"></textarea>
		</div>

		<div class="form-group">
			<button type="submit" class="btn btn-primary">Contact us!</button>
		</div>
	</form>
</script>

<script type="text/template" id="cardPage">
	<div class="box">
		<div class="box-header">
			<h1><%= title %></h1>
			<div class="toolbox"></div>
		</div>
		<div class="box-body">
			<% if(mediaLink) { %>
				<figure>
					<%= this.processMediaTag(mediaLink, title) %>
				</figure>
			<% } %>
			<div class="box-content"><%= description %></div>
		</div>
		<div class="box-footer">
			<ul class="soc-links">
				<% _.each(this.socialLinks(), function(link){ %>
					<li><%= link %></li>
				<% }) %>
			</ul>
		</div>
	</div>
</script>