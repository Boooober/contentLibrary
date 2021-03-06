<script type="text/template" id="loginForm">
	<div class="form-box form-box-sm">
		<div class="form-headline">
			<p>Login form</p>
		</div>

		<div class="box primary-box">
			<div class="box-body">
				<p class="form-title">Please log in to continue</p>

				<form class="login-form" method="post">
					<div class="form-group">
						<label for="loginName" class="sr-only">Your name:</label>
						<input id="loginName" name="username" type="text" class="form-control" placeholder="Your name"/>
					</div>

					<div class="form-group">
						<label for="loginPassword" class="sr-only">Your password:</label>
						<input id="loginPassword" name="password" type="password" class="form-control" placeholder="Your password"/>
					</div>

					<div class="row">
						<div class="col-sm-8">
							<div class="checkbox">
								<label for="rememberMe">
									<input id="rememberMe" type="checkbox"/>
									Remember me
								</label>
							</div>
						</div>
						<div class="col-sm-4">
							<div class="form-group">
								<button type="submit" class="btn btn-block btn-primary">Log in</button>
							</div>
						</div>
					</div>
				</form>
			</div>

			<div class="box-footer">
				<ul>
					<li><a href="#!/account/signin">I don`t have an accout</a></li>
					<li><a href="#!/account/recover">I forgot my password</a></li>
				</ul>
			</div>
		</div>
	</div>
</script>

<script type="text/template" id="signinForm">
	<div class="form-box form-box-sm">
		<div class="form-headline">
			<p>Signin form</p>
		</div>

		<div class="box primary-box">
			<div class="box-body">
				<p class="form-title">Please sign in</p>

				<form class="sigin-form" method="post">
					<div class="form-group">
						<label for="signName" class="sr-only">Your name:</label>
						<input id="signName" name="username" type="text" class="form-control" placeholder="Your name" data-validate='{"min":4}'/>
					</div>

					<div class="form-group">
						<label for="signEmail" class="sr-only">Your email:</label>
						<input id="signEmail" name="email" type="email" class="form-control" placeholder="Your email"/>
					</div>

					<div class="form-group">
						<label for="signPassword" class="sr-only">Your password:</label>
						<input id="signPassword" name="password" type="password" class="form-control" placeholder="Your password" data-validate='{"min":5}'/>
					</div>

					<div class="form-group">
						<label for="signPassword2" class="sr-only">Repeat your password:</label>
						<input id="signPassword2" name="password2" type="password" class="form-control" placeholder="Repeat your password" data-validate='{"equals":"#signPassword"}' required/>
					</div>

					<button type="submit" class="btn btn-block btn-primary">Sign in</button>

				</form>
			</div>

			<div class="box-footer">
				<ul>
					<li><a href="#!/account/login">Already have an account?</a></li>
				</ul>
			</div>
		</div>
	</div>
</script>

<script type="text/template" id="recoverForm">
	<div class="form-box form-box-sm">
		<div class="form-headline">
			<p>Account recover</p>
		</div>

		<div class="box primary-box">
			<div class="box-body">
				<p class="form-title">Please enter your email that was used on registration</p>

				<form class="sigin-form" method="post">

					<div class="form-group">
						<label for="signEmail" class="sr-only">Your email:</label>
						<input id="signEmail" name="email" type="email" class="form-control" placeholder="Your email" />
					</div>
					<button type="submit" class="btn btn-block btn-primary">Recover</button>

				</form>
			</div>

			<div class="box-footer">
				<ul>
					<li><a href="#!/account/login">I recalled my password!</a></li>
				</ul>
			</div>
		</div>
	</div>
</script>

<script type="text/template" id="profileEdit">
	<div class="form-box form-box-md">
		<div class="form-headline">
			<p><%= fullname %></p>
		</div>

		<div class="box primary-box">
			<div class="box-body">

				<form class="account-edit-form form-horizontal">
					<div class="clearfix">
						<div class="image-col">
							<figure class="account-image">
								<img src="<%= avatar %>" alt="<%= fullname %>" title="<%= fullname %>"/>
							</figure>
							<div class="account-image-button">
								<label for="accountAvatar" class="btn btn-primary btn-sm">Load image</label>
								<input id="accountAvatar" class="account-avatar hidden" type="file" name="avatar"/>
							</div>
						</div>

						<div class="form-col">

							<div class="form-group">
								<label for="accountUsername" class="col-sm-4 control-label">Username:</label>
								<div class="col-sm-8">
									<input id="accountUsername" name="username" type="text" class="form-control" disabled value="<%= username %>" placeholder="Username" required />
								</div>
							</div>

							<div class="form-group">
								<label for="accountFullname" class="col-sm-4 control-label">Full name:</label>
								<div class="col-sm-8">
									<input id="accountFullname" name="fullname" type="text" class="form-control" value="<%= fullname %>" placeholder="Full name" required />
								</div>
							</div>

							<div class="form-group">
								<label for="accountEmail" class="col-sm-4 control-label">Email:</label>
								<div class="col-sm-8">
									<input id="accountEmail" name="email" type="email" class="form-control" value="<%= email %>" placeholder="Email" required />
								</div>
							</div>

							<div class="form-group">
								<label for="accountPassword" class="col-sm-4 control-label">Password:</label>
								<div class="col-sm-8">
									<input id="accountPassword" name="password" type="password" class="form-control" placeholder="New password" required />
								</div>
							</div>
						</div>
						<div class="col-xs-12">
							<button type="submit" class="btn btn-primary pull-right">Update profile</button>
						</div>
					</div>


				</form>
			</div>
		</div>
	</div>
</script>

<script type="text/template" id="profileDestroy">
	<div class="form-box form-box-sm">
		<div class="form-headline">
			<p><%= fullname %></p>
		</div>

		<div class="box primary-box">
			<div class="box-body">

				<form class="account-destroy-form form-horizontal">
					<p class="form-title">Are you sure you want to delete your account?</p>
					<div class="clearfix">
						<button class="btn btn-danger pull-right destroy">Sure, delete</button>
						<button class="btn btn-primary">Cancel</button>
					</div>
				</form>

			</div>
		</div>
	</div>
</script>

<script type="text/template" id="addCard">
	<div class="form-box form-box-lg">
		<div class="form-headline">
			<p>Create content</p>
		</div>

		<div class="box primary-box">
			<div class="box-body">
				<form class="add-card-form">

					<div class="row">
						<div class="col-sm-8">
							<div class="form-group">
								<label for="cardTitle" class="sr-only">Title</label>
								<input id="cardTitle" name="title" type="text" class="form-control" value="<%= title %>" placeholder="Card title" required />
							</div>

							<div class="form-group">
								<label for="cardDescription" class="sr-only">Description</label>
								<textarea id="cardDescription" name="description" class="form-control" rows="10" placeholder="Description" required><%= description %></textarea>
							</div>

						</div>
						<div class="col-sm-4">
							<div class="form-group">
								<label for="cardType" class="sr-only">Type</label>
								<select name="cardType" id="cardType" class="form-control" required>
									<%= this.renderDropdown() %>
								</select>
							</div>

							<ul class="dependent-fields">

								<li data-type="video">
									<div class="form-group">
										<label for="cardVideo" class="sr-only">Title</label>
										<input id="cardVideo" name="mediaLink" type="text" class="form-control" value="<%= mediaLink %>" placeholder="Video link" data-validate='{"required":true}'/>
									</div>
								</li>

								<li data-type="image">
									<div class="form-group">
										<label for="cardImage" class="btn btn-primary btn-sm">Load image</label>
										<input id="cardImage" name="mediaLink" class="hidden" type="file" />
									</div>
								</li>
							</ul>
						</div>

						<div class="col-xs-12">
							<button class="btn btn-primary" type="submit">Publish</button>
						</div>
					</div>

				</form>

			</div>
		</div>
	</div>
</script>