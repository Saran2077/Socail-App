	import { Avatar, Box, Divider, Flex, Image, Modal, ModalBody, ModalContent, ModalFooter, Text, useDisclosure, Input, Button, Stack, Textarea } from '@chakra-ui/react'
	import { useState } from 'react';
	import { useRecoilState, useRecoilValue } from 'recoil';
	import userAtom from "./../atom/userAtom.js"
	import useShowToast from '../hooks/useShowToast.js';
	import postAtom from '../atom/postAtom.js';

	const Actions = ({ post }) => {
	const [currentUser, setCurrentUser] = useRecoilState(userAtom)
	const [posts, setPosts] = useRecoilState(postAtom)
	const[isLoading, setIsLoading] = useState(false)
	const[liked, setLiked] = useState(post?.likes.filter((like) => like.userId === currentUser.id).length > 0 ? true : false)
	const showToast = useShowToast()
	const { isOpen, onOpen, onClose } = useDisclosure()
	const[reply, setReply] = useState("")
	const likesModal = useDisclosure()
	const [updating, setUpdating] = useState(false)

	const handleRepost = async() => {
		if(!currentUser) return showToast("", "Login to use repost", "error")
		try {
			
		} catch (error) {
			showToast("", error.message, "error")
		}
	}

	const handleReply = async() => {
		if(!currentUser) return showToast("", "Login to post comments", "error")
		if (reply === "") return showToast("", "Enter a comment to post", "error")
		setIsLoading(true)
		try {
			const res = await fetch("/api/posts/reply/"+post?._id, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					text: reply
				})
			})
			const data = await res.json()
			if (data.error) {
				showToast("", data.error, "error")
				return 
			}
			showToast("", data.message, "success")
			setReply("")
			let updatedPost = posts.map((p) => {
				if (p._id === post._id) {
					return { ...p, replies: [data.reply, ...p.replies ]}
				}
				return p
			})
			setPosts(updatedPost)
			onClose()
		} catch (error) {
			console.log(error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleFollowUnfollow = async(user) => {
		if(!currentUser) {
			return
		}
		setUpdating(true)
		try {
			const res = await fetch(`/api/users/followUnfollow/${user._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				}
			})
			const data = await res.json()
			let updatedUser = {...currentUser}
			if(data.error) {
				showToast("", data.error, "error")
				return
			}
			updatedUser.following = following ? updatedUser.following.filter(id => id !== user._id)
			: [...updatedUser.following, user._id];
			following ? user.followers.filter(id => id != currentUser?.id) : user.followers.push(currentUser?.id)
			localStorage.setItem("user-info", JSON.stringify(updatedUser))
			setCurrentUser(updatedUser)
			setFollowing(!following)
			showToast("", data.message, "success")
		} catch (error) {
			console.log("error", error)
		}
		finally {
			setUpdating(false)
		}
	  }

	const handleLikeUnlike = async() => {
		try {
			const res = await fetch(`/api/posts/like/${post._id}`, {
				method: "POST",
			})
			const data =await res.json()
			if (data.error) {
				showToast("", data.error, "error")
				return
			}
			if(liked) {
				let updatedPost = posts.map((p) => {
					if (p._id === post._id) {
						return { ...p, likes: p.likes.filter((id) => id.userId != currentUser.id)}
					}
					return p
				})
				setPosts(updatedPost)
			}
			else{ 
				let updatedPost = posts.map((p) => {
					if (p._id === post._id) {
						return { ...p, likes: [...p.likes, data.like] }
					}
					return p
				})
				setPosts(updatedPost)
			}
			setLiked(!liked)
			showToast("", data.message, "success")
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<Flex w="full" flexDirection={"column"}>
			<Flex gap={2} alignItems={"center"} my={2} onClick={(e) => e.preventDefault()}>
				<svg
				aria-label='Like'
				color={liked ? "rgb(237, 73, 86)" : ""}
				fill={liked ? "rgb(237, 73, 86)" : "transparent"}
				height='19'
				role='img'
				viewBox='0 0 24 22'
				width='20'
				cursor={"pointer"}
				onClick={handleLikeUnlike}
						>
							<path
								d='M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z'
								stroke='currentColor'
								strokeWidth='2'
							></path>
				</svg>

				<svg
					aria-label='Comment'
					color=''
					fill=''
					height='20'
					role='img'
					viewBox='0 0 24 24'
					width='20'
					onClick={onOpen}
				>
					<title>Comment</title>
					<path
						d='M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z'
						fill='none'
						stroke='currentColor'
						strokeLinejoin='round'
						strokeWidth='2'
					></path>
				</svg>

				<RepostSVG />

				<ShareSVG />
			</Flex>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalContent bg={"#101010"}>
					<ModalBody>
						<Stack mt={5} gap={5}>
							<Flex alignItems={"center"} gap={3}>
								<Avatar src={currentUser?.profilePic} size={"md"}/>
								<Text>{currentUser?.username}</Text>
							</Flex>

							<Textarea placeholder='Write something' onChange={(e) => setReply(e.target.value)}/>
						</Stack>
					</ModalBody>
					<ModalFooter>
						<Flex>
							<Button borderRadius={20} isLoading={isLoading} onClick={handleReply} >Post</Button>
						</Flex>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<Modal isOpen={likesModal.isOpen} onClose={likesModal.onClose}>
				<ModalContent borderRadius={20}  bg={"#101010"} minHeight={"30vh"} maxHeight={"60vh"} overflow={"auto"} css={{
					"&::-webkit-scrollbar": {
						width: "4px"
					}
				}}>
                    <ModalBody>
                        <Stack mt={2}>
							<Text textAlign={"center"}>Likes</Text>
							<Divider mt={2}/>
                            {post?.likes.map((like) => {
								return(
									<Flex key={like.userId} mt={2} alignItems={"center"} justifyContent={"space-between"}>
										<Flex gap={3} alignItems={"center"}>
											<Avatar name={like.username} src={like.userProfilePic} size={"md"}/>
											<Text>{like.username}</Text>
										</Flex>
										<Button size={"sm"} bg={"rgb(0, 149, 246)"} _hover={{
											"background-color": "rgba(0, 130, 246)"
										}} onClick={(like) => handleFollowUnfollow(like)}>
											{currentUser?.following.includes(like.userId) ? "Unfollow" : "Follow"}
										</Button>
									</Flex>
								)
							})}
						</Stack>
					</ModalBody>
				</ModalContent>
			</Modal>
			<Flex gap={2} alignItems={"center"}>
					<Text cursor={"pointer"}  color={"gray.light"} fontSize="sm" onClick={(e) => {
						e.preventDefault()
						likesModal.onOpen()}}>
						{post?.likes.length}{post?.likes.length <= 1 ? " like" : " likes"}
					</Text>
					<Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
					<Text color={"gray.light"} fontSize="sm">
						{post?.replies.length}{post?.replies.length <= 1 ? " reply" : " replies"}
					</Text>
				</Flex>
		</Flex>
	)
	}

	const RepostSVG = () => {
		return (
			<svg
				aria-label='Repost'
				color='currentColor'
				fill='currentColor'
				height='20'
				role='img'
				viewBox='0 0 24 24'
				width='20'
			>
				<title>Repost</title>
				<path
					fill=''
					d='M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z'
				></path>
			</svg>
		);
	};

	const ShareSVG = () => {
		return (
			<svg
				aria-label='Share'
				color=''
				fill='rgb(243, 245, 247)'
				height='20'
				role='img'
				viewBox='0 0 24 24'
				width='20'
			>
				<title>Share</title>
				<line
					fill='none'
					stroke='currentColor'
					strokeLinejoin='round'
					strokeWidth='2'
					x1='22'
					x2='9.218'
					y1='3'
					y2='10.083'
				></line>
				<polygon
					fill='none'
					points='11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334'
					stroke='currentColor'
					strokeLinejoin='round'
					strokeWidth='2'
				></polygon>
			</svg>
		);
	};

	export default Actions