from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import OuterRef, Subquery
from django.db.models import Q

from api.models import User, Profile, ChatMessage

from api.serializer import MyTokenObtainPairSerializer, RegisterSerializer, MessageSerializer, ProfileSerializer,UserSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes





class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


# Get All Routes

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/register/',
        '/api/token/refresh/'
    ]
    return Response(routes)



@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def testEndPoint(request):
    if request.method == 'GET':
        data = f"Congratulations {request.user}, your API just responded to GET request"
        return Response({'response': data}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        text = "Hello buddy"
        data = f'Congratulation your API just responded to POST request with text: {text}'
        return Response({'response': data}, status=status.HTTP_200_OK)
    return Response({}, status.HTTP_400_BAD_REQUEST)



# Chat APP
class MyInbox(generics.ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']      #localhost/user_id/

        # if user with id is the sender or receiver
        messages = ChatMessage.objects.filter(
            id__in =  Subquery(
                User.objects.filter(
                    Q(sender__receiver=user_id) |
                    Q(receiver__sender=user_id)
                ).distinct().annotate(
                    # "distinct" ensures each user is considered only once, annotate for additional data
                    last_msg=Subquery(
                        #OuterRef =  To reference prev query of something (e.g : ID)
                        ChatMessage.objects.filter(
                            # if user with id is the sender or receiver of msgs
                            Q(sender=OuterRef('id'),receiver=user_id) |
                            Q(receiver=OuterRef('id'),sender=user_id)
                        ).order_by('-id')[:1].values_list('id',flat=True) #order msg in descending order by the 1st msg, and get amongst others the most recent msg 
                    )
                ).values_list('last_msg', flat=True).order_by("-id") #Extract list of IDs of latest msg, to be used to filter The main query at (Line 67)
            )
        ).order_by("-id")  #order msg in descending order based on their ID
            
        return messages
    

class GetMessages(generics.ListAPIView):
    serializer_class = MessageSerializer
    
    def get_queryset(self):
        sender_id = self.kwargs['sender_id']        #localhost/sender_id/
        receiver_id = self.kwargs['receiver_id']    #localhost/receiver_id/
        messages =  ChatMessage.objects.filter(
            sender__in=[sender_id, receiver_id], # Get where sender_id or receiver_id url is "sender"
            receiver__in=[sender_id, receiver_id]  # Get where sender_id or receiver_id url is "receiver"
        )
        return messages
    

class SendMessages(generics.CreateAPIView):
    serializer_class = MessageSerializer



# PROFILE VIEW
class ProfileDetail(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    permission_classes = [IsAuthenticated]


# SEARCH USERS
class SearchUser(generics.ListAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    permission_classes = [IsAuthenticated]  

    def list(self, request, *args, **kwargs):
        username = self.kwargs['username']
        logged_in_user = self.request.user
        users = Profile.objects.filter(
            # Lookup method in Profile model to get objects (e.g : "user.username", "full_name", "user.email")
            Q(user__username__icontains=username) | 
            Q(full_name__icontains=username) | 
            Q(user__email__icontains=username) & 
            ~Q(user=logged_in_user)  # Exclude the logged in user during the search query
        )

        # If no user
        if not users.exists():
            return Response(
                {"detail": "No users found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Else, pass the ProfileSerializer
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)

