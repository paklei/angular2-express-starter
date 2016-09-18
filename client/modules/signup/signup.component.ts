import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';

import {UserService} from './user.service';

@Component({
	selector: 'signup',
	templateUrl: './signup.component.html'
})

export class SignupComponent implements OnInit {

	private users = [];
	private isLoading = true;

	private user = {};
	private isEditing = false;

	private addUserForm: FormGroup;
	private name = new FormControl("", Validators.required);
	private lastnamep = new FormControl("", Validators.required);
	private lastnamem = new FormControl("", Validators.required);
	private nick = new FormControl("", Validators.required);
	private password = new FormControl("", Validators.required);

	private infoMsg = { body: "", type: "info"};

	constructor(private http: Http,
				private userService: UserService,
				private formBuilder: FormBuilder) {	}

	ngOnInit() {
		this.getUsers();

		this.addUserForm = this.formBuilder.group({
			name: this.name,
			lastnamep: this.lastnamep,
			lastnamem: this.lastnamem,
			nick: this.nick,
			password: this.password
		});
	}

	getUsers() {
		this.userService.getUsers().subscribe(
			data => this.users = data,
			error => console.log(error),
			() => this.isLoading = false
		);
	}

	addUser() {
		this.userService.addUser(this.addUserForm.value).subscribe(
			res => {
				var newUser = res.json();
				this.users.push(newUser);
				this.addUserForm.reset();
				this.sendInfoMsg("user added successfully.", "success");
			},
			error => console.log(error)
		);
	}

	enableEditing(user) {
		this.isEditing = true;
		this.user = user;
	}

	cancelEditing() {
		this.isEditing = false;
		this.user = {};
		this.sendInfoMsg("item editing cancelled.", "warning");
		// reload the cats to reset the editing
		this.getUsers();
	}

	editUser(user) {
		this.userService.editUser(user).subscribe(
			res => {
				this.isEditing = false;
				this.user = user;
				this.sendInfoMsg("user edited successfully.", "success");
			},
			error => console.log(error)
		);
	}

	deleteUser(user) {
		if(window.confirm("Are you sure you want to permanently delete this user?")) {
			this.userService.deleteUser(user).subscribe(
				res => {
					var pos = this.users.map(cat => { return cat._id }).indexOf(user._id);
					this.users.splice(pos, 1);
					this.sendInfoMsg("user deleted successfully.", "success");
				},
				error => console.log(error)
			);
		}
	}

	sendInfoMsg(body, type, time = 3000) {
		this.infoMsg.body = body;
		this.infoMsg.type = type;
		window.setTimeout(() => this.infoMsg.body = "", time);
	}

}